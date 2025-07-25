"use client";

import ShowDocument from "@/src/components/employee/document/ShowDocument";
import Filter from "@/src/components/global/filter/Filter";
import DocumentCard from "@/src/components/hr/document/DocumentCard";
import FolderCard from "@/src/components/hr/documentFolder/FolderCard";
import useCategory from "@/src/hooks/useCategory";
import useSearch from "@/src/hooks/useSearch";
import useSort from "@/src/hooks/useSort";
import {
  DocumentFolderInterface,
  DocumentInterface,
} from "@/src/interface/DocumentInterface";
import { UserInterface } from "@/src/interface/UserInterface";
import {
  EMPLOYEE_DOCUMENTS_CATEGORY,
  EMPLOYEE_DOCUMENTS_SEARCH,
  EMPLOYEE_DOCUMENTS_SORT,
} from "@/src/utils/filters";
import { getCSRFToken } from "@/src/utils/token";
import axios from "axios";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useParams } from "next/navigation";
import React from "react";
import { IoArrowBack } from "react-icons/io5";

const Document = () => {
  const [documents, setDocuments] = React.useState<
    ((DocumentInterface | DocumentFolderInterface) & UserInterface)[]
  >([]);
  const [folder, setFolder] = React.useState<DocumentFolderInterface>({
    name: "",
    path: 0,
  });
  const [activeDocumentSeeMore, setActiveDocumentSeeMore] = React.useState(0);

  const url = process.env.URL;
  const { data: session } = useSession({ required: true });
  const user = session?.user;
  const params = useParams();
  const folderId = params?.folder_id
    ? parseInt(params?.folder_id as string)
    : 0;

  const {
    search,
    debounceSearch,
    canSeeSearchDropDown,
    handleCanSeeSearchDropDown,
    handleSearch,
    handleSelectSearch,
  } = useSearch("name", "Name");
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
  } = useSort("name", "Name");

  const handleActiveDocumentSeeMore = (id: number) => {
    setActiveDocumentSeeMore((prev) => (prev === id ? 0 : id));
  };

  const getDocuments = React.useCallback(async () => {
    try {
      const { token } = await getCSRFToken();

      if (token && user?.token) {
        const { data: responseData } = await axios.get(
          `${url}/employee/document`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
              "X-CSRF-TOKEN": token,
            },
            withCredentials: true,
            params: { path: folderId, ...search, ...sort, ...category },
          }
        );

        if (responseData.documents) {
          setDocuments(responseData.documents);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [url, user?.token, folderId, search, sort, category]);

  const getFolder = React.useCallback(async () => {
    try {
      const { token } = await getCSRFToken();

      if (token && user?.token) {
        const { data: responseData } = await axios.get(
          `${url}/employee/document_folder/${folderId}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
              "X-CSRF-TOKEN": token,
            },
            withCredentials: true,
          }
        );

        if (responseData.folder) {
          setFolder(responseData.folder);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [url, user?.token, folderId]);

  const mappedDocuments = documents.map((document, index) => {
    const type = "type" in document ? document.type : "folder";
    const isDocument = type !== "folder";

    return isDocument ? (
      <DocumentCard
        role={user?.role ?? ""}
        createdBy={false}
        key={index}
        id={document.id}
        name={document.name}
        description={"description" in document ? document.description : ""}
        document={"document" in document ? document.document : ""}
        type={type}
        //
        first_name={document.first_name}
        last_name={document.last_name}
        email={document.email}
        email_verified_at={document.email_verified_at}
        user_id={document.user_id}
        //
        handleActiveSeeMore={() =>
          handleActiveDocumentSeeMore(document.id ?? 0)
        }
      />
    ) : (
      <FolderCard
        key={index}
        role={user?.role ?? ""}
        createdBy={false}
        id={document.id}
        name={document.name}
        //
        first_name={document.first_name}
        last_name={document.last_name}
        email={document.email}
        email_verified_at={document.email_verified_at}
        user_id={document.user_id}
      />
    );
  });

  React.useEffect(() => {
    getDocuments();
  }, [getDocuments]);

  React.useEffect(() => {
    getFolder();
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
          useCategoryFilter={true}
          useSearchFilter={true}
          useSortFilter={true}
          //
          searchKey={debounceSearch.searchKey}
          searchValue={debounceSearch.searchValue}
          searchLabel={debounceSearch.searchLabel}
          canSeeSearchDropDown={canSeeSearchDropDown}
          toggleCanSeeSearchDropDown={handleCanSeeSearchDropDown}
          onChange={handleSearch}
          selectSearch={handleSelectSearch}
          searchKeyLabelPairs={EMPLOYEE_DOCUMENTS_SEARCH}
          //
          categoryValue={category.categoryValue}
          canSeeCategoryDropDown={canSeeCategoryDropDown}
          toggleCanSeeCategoryDropDown={handleCanSeeCategoryDropDown}
          selectCategory={handleSelectCategory}
          categoryKeyValuePairs={EMPLOYEE_DOCUMENTS_CATEGORY}
          //
          sortKey={sort.sortKey}
          sortLabel={sort.sortLabel}
          isAsc={sort.isAsc}
          canSeeSortDropDown={canSeeSortDropDown}
          toggleCanSeeSortDropDown={handleCanSeeSortDropDown}
          toggleAsc={handleToggleAsc}
          selectSort={handleSelectSort}
          sortKeyLabelPairs={EMPLOYEE_DOCUMENTS_SORT}
        />

        {folderId ? (
          <div className="w-full flex flex-row items-center justify-between">
            <Link
              href={`/nest/employee/document/${folder.path}`}
              className="p-2 rounded-full hover:bg-neutral-100 transition-all"
            >
              <IoArrowBack />
            </Link>

            <p className="font-bold text-accent-blue">{folder.name}</p>
          </div>
        ) : null}

        <div className="w-full grid grid-cols-1 gap-4 t:grid-cols-2 l-l:grid-cols-3">
          {mappedDocuments}
        </div>
      </div>
    </div>
  );
};

export default Document;
