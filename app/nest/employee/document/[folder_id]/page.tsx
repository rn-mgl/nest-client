"use client";

import BaseActions from "@/src/components/global/base/BaseActions";
import BaseCard from "@/src/components/global/base/BaseCard";
import FolderCard from "@/src/components/global/document/FolderCard";
import ShowDocument from "@/src/components/global/document/ShowDocument";
import Filter from "@/src/components/global/filter/Filter";
import PageSkeletonLoader from "@/src/components/global/loader/PageSkeletonLoader";
import { useToasts } from "@/src/context/ToastContext";
import useCategory from "@/src/hooks/useCategory";
import useFilterAndSort from "@/src/hooks/useFilterAndSort";
import useIsLoading from "@/src/hooks/useIsLoading";
import useSearch from "@/src/hooks/useSearch";
import useSort from "@/src/hooks/useSort";
import {
  DocumentInterface,
  FolderInterface,
} from "@/src/interface/DocumentInterface";
import {
  EMPLOYEE_DOCUMENTS_CATEGORY,
  EMPLOYEE_DOCUMENTS_SEARCH,
  EMPLOYEE_DOCUMENTS_SORT,
} from "@/src/utils/filters";
import {
  isDocumentSummary,
  isFolderSummary,
  isUserSummary,
} from "@/src/utils/utils";
import axios from "axios";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useParams } from "next/navigation";
import React from "react";
import { IoArrowBack } from "react-icons/io5";

const Document = () => {
  const [documents, setDocuments] = React.useState<
    (DocumentInterface | FolderInterface)[]
  >([]);
  const [folder, setFolder] = React.useState<FolderInterface>({
    title: "",
    path: 0,
    created_by: 0,
  });
  const [activeDocumentSeeMore, setActiveDocumentSeeMore] = React.useState(0);
  const { isLoading, handleIsLoading } = useIsLoading();

  const { addToast } = useToasts();

  const url = process.env.URL;
  const { data: session } = useSession({ required: true });
  const user = session?.user;
  const params = useParams();
  const folderId = params?.folder_id ? Number(params?.folder_id) : 0;

  const {
    search,
    canSeeSearchDropDown,
    handleCanSeeSearchDropDown,
    handleSearch,
    handleSelectSearch,
  } = useSearch("title", "Title");

  const {
    category,
    canSeeCategoryDropDown,
    handleCanSeeCategoryDropDown,
    handleSelectCategory,
  } = useCategory("", "All");

  const {
    sort,
    canSeeSortDropDown,
    handleCanSeeSortDropDown,
    handleSelectSort,
    handleToggleAsc,
  } = useSort("title", "Title");

  const handleActiveDocumentSeeMore = (id: number) => {
    setActiveDocumentSeeMore((prev) => (prev === id ? 0 : id));
  };

  const getDocuments = React.useCallback(
    async (controller: AbortController) => {
      handleIsLoading(true);

      try {
        if (user?.token) {
          const { data: responseData } = await axios.get(
            `${url}/employee/document`,
            {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
              params: { path: folderId },
              withCredentials: true,
              signal: controller.signal,
            }
          );

          if (responseData.documents) {
            setDocuments(responseData.documents);
          }
        }
      } catch (error) {
        console.log(error);

        if (axios.isAxiosError(error) && error.code !== "ERR_CANCELED") {
          const message =
            error.response?.data.message ??
            error.message ??
            "An error occurred when the documents and folders are being retrieved.";
          addToast("Document Error", message, "error");
        }
      } finally {
        handleIsLoading(false);
      }
    },
    [url, user?.token, folderId, addToast, handleIsLoading]
  );

  const getFolder = React.useCallback(
    async (controller: AbortController) => {
      handleIsLoading(true);
      try {
        if (user?.token && folderId) {
          const { data: responseData } = await axios.get(
            `${url}/employee/folder/${folderId}`,
            {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
              withCredentials: true,
              signal: controller.signal,
            }
          );

          if (responseData.folder) {
            setFolder(responseData.folder);
          }
        }
      } catch (error) {
        console.log(error);

        if (axios.isAxiosError(error) && error.code !== "ERR_CANCELED") {
          const message =
            error.response?.data.message ??
            error.message ??
            "An error occurred when the folder details is being retrieved.";
          addToast("Folder Error", message, "error");
        }
      } finally {
        handleIsLoading(false);
      }
    },
    [url, user?.token, folderId, addToast, handleIsLoading]
  );

  const mappedDocuments = useFilterAndSort(
    documents,
    search,
    sort,
    category
  ).map((document, index) => {
    const isDocument = isDocumentSummary(document);
    const isFolder = isFolderSummary(document);
    const createdBy = isUserSummary(document.created_by)
      ? document.created_by.first_name
      : null;

    return isDocument ? (
      <BaseCard
        key={index}
        title={document.title}
        description={document.description}
        createdBy={createdBy}
      >
        <BaseActions
          handleActiveSeeMore={() =>
            handleActiveDocumentSeeMore(document.id ?? 0)
          }
        />
      </BaseCard>
    ) : isFolder ? (
      <FolderCard key={index} createdBy={createdBy} folder={document} />
    ) : null;
  });

  React.useEffect(() => {
    const controller = new AbortController();

    getDocuments(controller);

    return () => {
      controller.abort();
    };
  }, [getDocuments]);

  React.useEffect(() => {
    const controller = new AbortController();

    getFolder(controller);

    return () => {
      controller.abort();
    };
  }, [getFolder]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-start">
      {activeDocumentSeeMore ? (
        <ShowDocument
          id={activeDocumentSeeMore}
          toggleModal={() => handleActiveDocumentSeeMore(0)}
        />
      ) : null}
      <div
        className="w-full h-full flex flex-col items-center justify-start max-w-(--breakpoint-l-l) p-2
                    t:items-start t:p-4 gap-4 t:gap-8"
      >
        <Filter
          //
          searchKeyLabelPairs={EMPLOYEE_DOCUMENTS_SEARCH}
          search={{
            searchKey: search.searchKey,
            searchValue: search.searchValue,
            searchLabel: search.searchLabel,
            canSeeSearchDropDown: canSeeSearchDropDown,
            toggleCanSeeSearchDropDown: handleCanSeeSearchDropDown,
            onChange: handleSearch,
            selectSearch: handleSelectSearch,
          }}
          //
          categoryKeyValuePairs={EMPLOYEE_DOCUMENTS_CATEGORY}
          category={{
            categoryKey: category.categoryKey,
            categoryValue: category.categoryValue,
            canSeeCategoryDropDown: canSeeCategoryDropDown,
            toggleCanSeeCategoryDropDown: handleCanSeeCategoryDropDown,
            selectCategory: handleSelectCategory,
          }}
          //
          sortKeyLabelPairs={EMPLOYEE_DOCUMENTS_SORT}
          sort={{
            sortKey: sort.sortKey,
            sortLabel: sort.sortLabel,
            isAsc: sort.isAsc,
            canSeeSortDropDown: canSeeSortDropDown,
            toggleCanSeeSortDropDown: handleCanSeeSortDropDown,
            toggleAsc: handleToggleAsc,
            selectSort: handleSelectSort,
          }}
        />

        {isLoading ? (
          <PageSkeletonLoader />
        ) : (
          <React.Fragment>
            {" "}
            {folderId ? (
              <div className="w-full flex flex-col items-start justify-between t:w-40 gap-2">
                <div className="w-full rounded-md bg-linear-to-br from-accent-yellow/30 to-accent-blue/30 p-2 text-center">
                  <p className="font-bold text-neutral-900">
                    {folder.title ?? "-"}
                  </p>
                </div>

                <Link
                  href={`${folder.path}`}
                  className="p-2 rounded-md hover:bg-neutral-100 transition-all"
                >
                  <IoArrowBack />
                </Link>
              </div>
            ) : null}
            <div className="w-full gap-4 columns-1 space-y-4 t:columns-2 h-full *:break-inside-avoid l-l:columns-3">
              {mappedDocuments}
            </div>
          </React.Fragment>
        )}
      </div>
    </div>
  );
};

export default Document;
