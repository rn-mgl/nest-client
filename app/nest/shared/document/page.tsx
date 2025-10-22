"use client";

import FolderCard from "@/src/components/document/FolderCard";
import ShowDocument from "@/src/components/document/ShowDocument";
import DeleteEntity from "@/src/components/global/entity/DeleteEntity";
import Filter from "@/src/components/global/filter/Filter";
import PageSkeletonLoader from "@/src/components/global/loader/PageSkeletonLoader";
import BaseActions from "@/src/components/global/resource/BaseActions";
import BaseCard from "@/src/components/global/resource/BaseCard";
import ResourceActions from "@/src/components/global/resource/ResourceActions";
import CreateDocument from "@/src/components/document/CreateDocument";
import CreateFolder from "@/src/components/document/CreateFolder";
import EditDocument from "@/src/components/document/EditDocument";
import EditFolder from "@/src/components/document/EditFolder";
import {
  HR_DOCUMENTS_CATEGORY,
  HR_DOCUMENTS_SEARCH,
  HR_DOCUMENTS_SORT,
  HR_FOLDERS_SEARCH,
} from "@/src/configs/filters";
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
  isDocumentSummary,
  isFolderSummary,
  isUserSummary,
} from "@/src/utils/utils";
import axios, { isAxiosError } from "axios";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import { IoAdd, IoArrowBack, IoPencil, IoTrash } from "react-icons/io5";

const Document = ({
  searchParams,
}: {
  searchParams: Promise<{ path?: string }>;
}) => {
  const [canCreateDocument, setCanCreateDocument] = React.useState(false);
  const [folder, setFolder] = React.useState<FolderInterface>({
    title: "",
    path: 0,
    created_by: 0,
  });
  const [canCreateFolder, setCanCreateFolder] = React.useState(false);
  const [documents, setDocuments] = React.useState<
    (
      | (DocumentInterface & { type: "Document" })
      | (FolderInterface & { type: "Folder" })
    )[]
  >([]);
  const [activeEditDocument, setActiveEditDocument] = React.useState(0);
  const [activeDeleteDocument, setActiveDeleteDocument] = React.useState(0);
  const [activeEditFolder, setActiveEditFolder] = React.useState(0);
  const [activeDeleteFolder, setActiveDeleteFolder] = React.useState(0);
  const [activeDocumentSeeMore, setActiveDocumentSeeMore] = React.useState(0);
  const { isLoading, handleIsLoading } = useIsLoading();

  const { addToast } = useToasts();

  const {
    canSeeSearchDropDown,
    search,
    handleCanSeeSearchDropDown,
    handleSearch,
    handleSelectSearch,
  } = useSearch("title", "Title");

  const {
    category,
    canSeeCategoryDropDown,
    toggleCanSeeCategoryDropDown,
    handleSelectCategory,
  } = useCategory("type", "All");

  const {
    sort,
    canSeeSortDropDown,
    handleCanSeeSortDropDown,
    handleSelectSort,
    handleToggleAsc,
  } = useSort("created_at", "Created At");

  const { data } = useSession({ required: true });
  const user = data?.user;
  const url = process.env.URL;

  const { path } = React.use(searchParams) ?? 0;

  const canEditDocument = React.useMemo(() => {
    return user?.permissions.includes("update.document_resource");
  }, [user?.permissions]);

  const canEditFolder = React.useMemo(() => {
    return user?.permissions.includes("update.folder_resource");
  }, [user?.permissions]);

  const canDeleteDocument = React.useMemo(() => {
    return user?.permissions.includes("delete.document_resource");
  }, [user?.permissions]);

  const canDeleteFolder = React.useMemo(() => {
    return user?.permissions.includes("delete.folder_resource");
  }, [user?.permissions]);

  const canManageDocument = React.useMemo(() => {
    return canEditDocument || canDeleteDocument;
  }, [canEditDocument, canDeleteDocument]);

  const canManageFolder = React.useMemo(() => {
    return canEditFolder || canDeleteFolder;
  }, [canEditFolder, canDeleteFolder]);

  const handleCanCreateDocument = () => {
    setCanCreateDocument((prev) => !prev);
  };

  const handleCanCreateFolder = () => {
    setCanCreateFolder((prev) => !prev);
  };

  const handleActiveEditDocument = (id: number) => {
    setActiveEditDocument((prev) => (prev === id ? 0 : id));
  };

  const handleActiveEditFolder = (id: number) => {
    setActiveEditFolder((prev) => (prev === id ? 0 : id));
  };

  const handleActiveDeleteFolder = (id: number) => {
    setActiveDeleteFolder((prev) => (prev === id ? 0 : id));
  };

  const handleActiveDeleteDocument = (id: number) => {
    setActiveDeleteDocument((prev) => (prev === id ? 0 : id));
  };

  const handleActiveDocumentSeeMore = (id: number) => {
    setActiveDocumentSeeMore((prev) => (prev === id ? 0 : id));
  };

  const getDocuments = React.useCallback(
    async (controller?: AbortController) => {
      handleIsLoading(true);
      try {
        if (user?.token) {
          const {
            data: { documents },
          } = await axios.get(`${url}/document/resource`, {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
            withCredentials: true,
            params: { path: Number(path) },
            signal: controller?.signal,
          });

          if (documents) {
            setDocuments(documents);
          }
        }
      } catch (error) {
        console.log(error);

        if (isAxiosError(error) && error.code !== "ERR_CANCELED") {
          const message =
            error.response?.data.message ??
            error.message ??
            "An error occurred when the documents and folders are being retrieved";
          addToast("Document Error", message, "error");
        }
      } finally {
        handleIsLoading(false);
      }
    },
    [url, user?.token, path, addToast, handleIsLoading]
  );

  const getFolder = React.useCallback(
    async (controller?: AbortController) => {
      handleIsLoading(true);
      try {
        if (user?.token && Number(path)) {
          const { data: folderDetails } = await axios.get(
            `${url}/folder/resource/${path}`,
            {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
              withCredentials: true,
              signal: controller?.signal,
            }
          );

          if (folderDetails.folder) {
            setFolder(folderDetails.folder);
          }
        }
      } catch (error) {
        console.log(error);

        if (isAxiosError(error) && error.code !== "ERR_CANCELED") {
          const message =
            error.response?.data.message ??
            error.message ??
            "An error occurred when the  folder data is being retrieved";
          addToast("Folder Error", message, "error");
        }
      } finally {
        handleIsLoading(false);
      }
    },
    [user?.token, path, url, addToast, handleIsLoading]
  );

  const mappedDocuments = useFilterAndSort(
    documents,
    search,
    sort,
    category
  ).map((document) => {
    const isDocument = isDocumentSummary(document);
    const isFolder = isFolderSummary(document);
    const createdBy = isUserSummary(document.created_by)
      ? document.created_by.first_name
      : null;

    return isDocument ? (
      <BaseCard
        key={`${document.title}-${document.id}-document`}
        title={document.title}
        description={document.description}
        createdBy={createdBy}
      >
        <BaseActions
          handleActiveSeeMore={() =>
            handleActiveDocumentSeeMore(document.id ?? 0)
          }
        />
        {canManageDocument ? (
          <ResourceActions
            handleActiveEdit={
              canEditDocument
                ? () => handleActiveEditDocument(document.id ?? 0)
                : null
            }
            handleActiveDelete={
              canDeleteDocument
                ? () => handleActiveDeleteDocument(document.id ?? 0)
                : null
            }
          />
        ) : null}
      </BaseCard>
    ) : isFolder ? (
      <FolderCard
        key={`${document.title}-${document.id}-folder`}
        createdBy={createdBy}
        folder={{ ...document }}
      >
        {canManageFolder ? (
          <div className="w-full flex flex-row items-center justify-end gap-2">
            {canEditFolder ? (
              <button
                className="hover:bg-neutral-900/20 transition-all p-2 rounded-sm"
                onClick={() => handleActiveEditFolder(document.id ?? 0)}
              >
                <IoPencil />
              </button>
            ) : null}

            {canDeleteFolder ? (
              <button
                className="hover:bg-neutral-900/20 transition-all p-2 rounded-sm"
                onClick={() => handleActiveDeleteFolder(document.id ?? 0)}
              >
                <IoTrash />
              </button>
            ) : null}
          </div>
        ) : null}
      </FolderCard>
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
      {canCreateDocument &&
      user?.permissions.includes("create.document_resource") ? (
        <CreateDocument
          path={path ?? 0}
          toggleModal={handleCanCreateDocument}
          refetchIndex={getDocuments}
        />
      ) : null}

      {canCreateFolder &&
      user?.permissions.includes("create.folder_resource") ? (
        <CreateFolder
          path={path ?? 0}
          toggleModal={handleCanCreateFolder}
          refetchIndex={getDocuments}
        />
      ) : null}

      {activeEditDocument &&
      user?.permissions.includes("update.document_resource") ? (
        <EditDocument
          id={activeEditDocument}
          toggleModal={() => handleActiveEditDocument(activeEditDocument)}
          refetchIndex={getDocuments}
        />
      ) : null}

      {activeEditFolder &&
      user?.permissions.includes("update.folder_resource") ? (
        <EditFolder
          id={activeEditFolder}
          toggleModal={() => handleActiveEditFolder(activeEditFolder)}
          refetchIndex={getDocuments}
        />
      ) : null}

      {activeDeleteDocument &&
      user?.permissions.includes("delete.document_resource") ? (
        <DeleteEntity
          route="document/resource"
          label="Document"
          id={activeDeleteDocument}
          toggleModal={() => handleActiveDeleteDocument(activeDeleteDocument)}
          refetchIndex={getDocuments}
        />
      ) : null}

      {activeDeleteFolder &&
      user?.permissions.includes("delete.folder_resource") ? (
        <DeleteEntity
          route="folder/resource"
          label="Folder"
          id={activeDeleteFolder}
          toggleModal={() => handleActiveDeleteFolder(activeDeleteFolder)}
          refetchIndex={getDocuments}
        />
      ) : null}

      {activeDocumentSeeMore ? (
        <ShowDocument
          id={activeDocumentSeeMore}
          toggleModal={() => handleActiveDocumentSeeMore(activeDocumentSeeMore)}
        />
      ) : null}

      <div
        className="w-full flex flex-col items-center justify-start max-w-(--breakpoint-l-l) p-2
          t:items-start t:p-4 gap-4 t:gap-8"
      >
        <Filter
          searchKeyLabelPairs={
            category.categoryValue === "All" ||
            category.categoryValue === "Documents"
              ? HR_DOCUMENTS_SEARCH
              : HR_FOLDERS_SEARCH
          }
          search={{
            searchKey: search.searchKey,
            searchLabel: search.searchLabel,
            searchValue: search.searchValue,
            canSeeSearchDropDown: canSeeSearchDropDown,
            selectSearch: handleSelectSearch,
            toggleCanSeeSearchDropDown: handleCanSeeSearchDropDown,
            onChange: handleSearch,
          }}
          //
          categoryKeyValuePairs={HR_DOCUMENTS_CATEGORY}
          category={{
            categoryKey: category.categoryKey,
            categoryValue: category.categoryValue,
            canSeeCategoryDropDown: canSeeCategoryDropDown,
            toggleCanSeeCategoryDropDown: toggleCanSeeCategoryDropDown,
            selectCategory: handleSelectCategory,
          }}
          //
          sortKeyLabelPairs={HR_DOCUMENTS_SORT}
          sort={{
            sortKey: sort.sortKey,
            sortLabel: sort.sortLabel,
            isAsc: sort.isAsc,
            canSeeSortDropDown: canSeeSortDropDown,
            toggleAsc: handleToggleAsc,
            selectSort: handleSelectSort,
            toggleCanSeeSortDropDown: handleCanSeeSortDropDown,
          }}
        />

        <div className="w-full flex flex-col items-center justify-start gap-2 t:flex-row">
          {user?.permissions.includes("create.document_resource") ? (
            <button
              onClick={handleCanCreateDocument}
              className="bg-accent-blue text-accent-yellow w-full p-2 rounded-md font-bold flex flex-row items-center justify-center 
                          gap-2 t:w-fit t:px-4 transition-all"
            >
              Create Document
              <IoAdd className="text-lg" />
            </button>
          ) : null}

          {user?.permissions.includes("create.folder_resource") ? (
            <button
              onClick={handleCanCreateFolder}
              className="border-2 border-accent-blue text-accent-blue w-full p-1.75 rounded-md font-bold flex flex-row items-center justify-center 
                          gap-2 t:w-fit t:px-4 transition-all bg-white"
            >
              Create Folder
              <IoAdd className="text-lg" />
            </button>
          ) : null}
        </div>

        {isLoading ? (
          <PageSkeletonLoader />
        ) : (
          <React.Fragment>
            {Number(path) ? (
              <div className="w-full flex flex-col items-start justify-between">
                <div className="w-full t:w-40 rounded-md bg-linear-to-br from-accent-yellow/30 to-accent-blue/30 p-2 text-center">
                  <p className="font-bold text-neutral-900">
                    {folder.title ?? "-"}
                  </p>
                </div>

                <Link
                  href={`?path=${folder.path}`}
                  className="p-2 rounded-full hover:bg-neutral-100 transition-all"
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
