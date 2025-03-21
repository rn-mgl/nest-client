"use client";

import Filter from "@/src/components/global/Filter";
import CreateDocument from "@/src/components/hr/document/CreateDocument";
import DeleteDocument from "@/src/components/hr/document/DeleteDocument";
import EditDocument from "@/src/components/hr/document/EditDocument";
import ShowDocument from "@/src/components/hr/document/ShowDocument";
import CreateDocumentFolder from "@/src/components/hr/documentFolder/CreateDocumentFolder";
import DeleteFolder from "@/src/components/hr/documentFolder/DeleteFolder";
import EditFolder from "@/src/components/hr/documentFolder/EditFolder";
import useCategory from "@/src/hooks/useCategory";
import useFilters from "@/src/hooks/useFilters";
import useSearch from "@/src/hooks/useSearch";
import useSort from "@/src/hooks/useSort";
import {
  DocumentFolderInterface,
  DocumentInterface,
} from "@/src/interface/DocumentInterface";
import { UserInterface } from "@/src/interface/UserInterface";
import {
  HR_DOCUMENTS_CATEGORY,
  HR_DOCUMENTS_SEARCH,
  HR_DOCUMENTS_SORT,
  HR_FOLDERS_SEARCH,
} from "@/src/utils/filters";
import { getCSRFToken } from "@/src/utils/token";
import axios from "axios";
import { getCookie } from "cookies-next";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useParams } from "next/navigation";
import React from "react";
import {
  IoAdd,
  IoArrowBack,
  IoArrowForward,
  IoEllipsisVertical,
  IoPencil,
  IoTrash,
} from "react-icons/io5";

const HRDocument = () => {
  const [canCreateDocument, setCanCreateDocument] = React.useState(false);
  const [folder, setFolder] = React.useState<DocumentFolderInterface>({
    name: "",
    path: { label: "Home", value: 0 },
  });
  const [canCreateFolder, setCanCreateFolder] = React.useState(false);
  const [activeDocumentMenu, setActiveDocumentMenu] = React.useState<{
    type: string;
    id: number;
  }>({ type: "", id: 0 });
  const [documents, setDocuments] = React.useState<
    Array<
      | (DocumentInterface & UserInterface)
      | (DocumentFolderInterface & UserInterface)
    >
  >([]);
  const [canEditDocument, setCanEditDocument] = React.useState(false);
  const [canDeleteDocument, setCanDeleteDocument] = React.useState(false);
  const [canEditFolder, setCanEditFolder] = React.useState(false);
  const [canDeleteFolder, setCanDeleteFolder] = React.useState(false);
  const [activeDocumentSeeMore, setActiveDocumentSeeMore] = React.useState(0);

  const {
    canShowSearch,
    debounceSearch,
    search,
    handleCanShowSearch,
    handleSearch,
    handleSelectSearch,
  } = useSearch("name", "Name");
  const { showFilters, handleShowFilters } = useFilters();
  const {
    category,
    canShowCategories,
    handleCanShowCategories,
    handleSelectCategory,
  } = useCategory("all", "all", "All");
  const {
    sort,
    canShowSort,
    handleCanShowSort,
    handleSelectSort,
    handleToggleAsc,
  } = useSort("name", "Name");

  const { data } = useSession({ required: true });
  const user = data?.user;
  const url = process.env.URL;

  const params = useParams();
  const folderId = params?.folder_id ? parseInt(params.folder_id as string) : 0;

  const handleCanCreateDocument = () => {
    setCanCreateDocument((prev) => !prev);
  };

  const handleCanCreateFolder = () => {
    setCanCreateFolder((prev) => !prev);
  };

  const handleCanEditDocument = () => {
    setCanEditDocument((prev) => !prev);
  };

  const handleCanEditFolder = () => {
    setCanEditFolder((prev) => !prev);
  };

  const handleCanDeleteFolder = () => {
    setCanDeleteFolder((prev) => !prev);
  };

  const handleCanDeleteDocument = () => {
    setCanDeleteDocument((prev) => !prev);
  };

  const handleActiveDocumentSeeMore = (id: number) => {
    setActiveDocumentSeeMore((prev) => (prev === id ? 0 : id));
  };

  const handleActiveDocumentMenu = (type: string, id: number) => {
    setActiveDocumentMenu((prev) => {
      const defaultSet = { type: "", id: 0 };
      const newSet =
        prev.type === type && prev.id === id ? defaultSet : { type, id };

      return newSet;
    });
  };

  const getDocuments = React.useCallback(async () => {
    try {
      const { token } = await getCSRFToken();

      if (token && user?.token) {
        const {
          data: { documents },
        } = await axios.get(`${url}/hr/document`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "X-XSRF-TOKEN": getCookie("XSRF-TOKEN"),
          },
          withCredentials: true,
          params: { path: folderId, ...search, ...sort, ...category },
        });

        if (documents) {
          setDocuments(documents);
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
        const { data: folderDetails } = await axios.get(
          `${url}/hr/document_folder/${folderId}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
              "X-XSRF-TOKEN": getCookie("XSRF-TOKEN"),
            },
            withCredentials: true,
          }
        );

        if (folderDetails.folder) {
          setFolder(folderDetails.folder);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [user?.token, folderId, url]);

  const mappedDocuments = documents.map((document, index) => {
    const type = "type" in document ? document.type : "folder";
    const isDocument = type !== "folder";
    const createdBy = document.created_by === user?.current;
    const activeMenu =
      type === activeDocumentMenu.type && document.id === activeDocumentMenu.id;

    return isDocument ? (
      <div
        key={index}
        className="w-full h-full p-4 rounded-md bg-neutral-100 flex flex-col items-start justify-start gap-4 relative  max-h-56 max-w-full"
      >
        <div className="flex flex-row items-start justify-between w-full">
          <div className="flex flex-col items-start justify-start">
            <p className="font-bold truncate">{document.name}</p>
            <p className="text-xs">
              created by {createdBy ? "you" : `${document.first_name}`}
            </p>
          </div>

          <button
            onClick={() =>
              document.id && handleActiveDocumentMenu(type, document.id)
            }
            className="p-2 rounded-full bg-neutral-100 transition-all"
          >
            <IoEllipsisVertical
              className={`${
                activeMenu ? "text-accent-blue" : "text-neutral-900"
              }`}
            />
          </button>
        </div>

        <div className="w-full h-full flex flex-col items-center justify-start overflow-y-auto p-2 bg-neutral-200 rounded-xs">
          <p className="text-sm w-full text-wrap break-words">
            {"description" in document ? document.description : null}
          </p>
        </div>

        {activeMenu ? (
          <div className="w-32 p-2 rounded-md top-12 right-6 shadow-md bg-neutral-200 absolute animate-fade z-20">
            <button
              onClick={handleCanEditDocument}
              className="w-full p-1 rounded-xs text-sm bg-neutral-200 transition-all flex flex-row gap-2 items-center justify-start"
            >
              <IoPencil className="text-accent-blue" />
              Edit
            </button>

            {createdBy ? (
              <button
                onClick={handleCanDeleteDocument}
                className="w-full p-1 rounded-xs text-sm bg-neutral-200 transition-all flex flex-row gap-2 items-center justify-start"
              >
                <IoTrash className="text-red-600" />
                Delete
              </button>
            ) : null}
          </div>
        ) : null}

        <div className="w-full flex flex-col items-center justify-center ">
          <button
            onClick={() => handleActiveDocumentSeeMore(document.id as number)}
            className="text-xs flex flex-row items-center justify-center gap-1 hover:underline underline-offset-2"
          >
            See More <IoArrowForward />
          </button>
        </div>
      </div>
    ) : (
      <div
        key={index}
        className="w-full h-full p-4 rounded-md bg-linear-to-br from-accent-yellow/30 to-accent-blue/30 flex flex-col items-start justify-start gap-4 relative  max-h-56 max-w-full"
      >
        <div className="flex flex-row items-start justify-between w-full">
          <div className="flex flex-col items-start justify-start">
            <Link
              href={`/nest/hr/document/${document.id}`}
              className="font-bold truncate hover:underline"
            >
              {document.name}
            </Link>
            <p className="text-xs">
              created by {createdBy ? "you" : `${document.first_name}`}
            </p>
          </div>

          <button
            onClick={() =>
              document.id && handleActiveDocumentMenu(type, document.id)
            }
            className="p-2 rounded-full hover:bg-white transition-all"
          >
            <IoEllipsisVertical
              className={`${
                activeMenu ? "text-accent-blue" : "text-neutral-900"
              }`}
            />
          </button>

          {activeMenu ? (
            <div className="w-32 p-2 rounded-md top-12 right-6 shadow-md bg-neutral-200 absolute animate-fade z-20">
              <button
                onClick={handleCanEditFolder}
                className="w-full p-1 rounded-xs text-sm bg-neutral-200 transition-all flex flex-row gap-2 items-center justify-start"
              >
                <IoPencil className="text-accent-blue" />
                Edit
              </button>

              {createdBy ? (
                <button
                  onClick={handleCanDeleteFolder}
                  className="w-full p-1 rounded-xs text-sm bg-neutral-200 transition-all flex flex-row gap-2 items-center justify-start"
                >
                  <IoTrash className="text-red-600" />
                  Delete
                </button>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
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
      {canCreateDocument ? (
        <CreateDocument
          toggleModal={handleCanCreateDocument}
          refetchIndex={getDocuments}
        />
      ) : null}

      {canCreateFolder ? (
        <CreateDocumentFolder
          toggleModal={handleCanCreateFolder}
          refetchIndex={getDocuments}
        />
      ) : null}

      {canEditDocument ? (
        <EditDocument
          id={activeDocumentMenu.id}
          toggleModal={handleCanEditDocument}
          refetchIndex={getDocuments}
        />
      ) : null}

      {canEditFolder ? (
        <EditFolder
          id={activeDocumentMenu.id}
          toggleModal={handleCanEditFolder}
          refetchIndex={getDocuments}
        />
      ) : null}

      {canDeleteDocument ? (
        <DeleteDocument
          id={activeDocumentMenu.id}
          toggleModal={handleCanDeleteDocument}
          refetchIndex={getDocuments}
        />
      ) : null}

      {canDeleteFolder ? (
        <DeleteFolder
          id={activeDocumentMenu.id}
          toggleModal={handleCanDeleteFolder}
          refetchIndex={getDocuments}
        />
      ) : null}

      {activeDocumentSeeMore ? (
        <ShowDocument
          id={activeDocumentSeeMore}
          setActiveModal={handleActiveDocumentSeeMore}
        />
      ) : null}

      <div
        className="w-full flex flex-col items-center justify-start max-w-(--breakpoint-l-l) p-2
          t:items-start t:p-4 gap-4 t:gap-8"
      >
        <Filter
          showSearch={true}
          showSort={true}
          showCategory={true}
          searchKey={debounceSearch.searchKey}
          searchLabel={debounceSearch.searchLabel}
          searchValue={debounceSearch.searchValue}
          searchKeyLabelPairs={
            category.categoryValue === "all" ||
            category.categoryValue === "documents"
              ? HR_DOCUMENTS_SEARCH
              : HR_FOLDERS_SEARCH
          }
          canShowSearch={canShowSearch}
          selectSearch={handleSelectSearch}
          toggleShowSearch={handleCanShowSearch}
          onChange={handleSearch}
          showFilters={showFilters}
          toggleShowFilters={handleShowFilters}
          categoryLabel={category.categoryLabel}
          canShowCategories={canShowCategories}
          categoryKeyValuePairs={HR_DOCUMENTS_CATEGORY}
          toggleShowCategories={handleCanShowCategories}
          selectCategory={handleSelectCategory}
          sortKey={sort.sortKey}
          sortLabel={sort.sortLabel}
          isAsc={sort.isAsc}
          canShowSort={canShowSort}
          sortKeyLabelPairs={HR_DOCUMENTS_SORT}
          toggleAsc={handleToggleAsc}
          selectSort={handleSelectSort}
          toggleShowSort={handleCanShowSort}
        />

        <div className="w-full flex flex-col items-center justify-start gap-2 t:flex-row">
          <button
            onClick={handleCanCreateDocument}
            className="bg-accent-blue text-accent-yellow w-full p-2 rounded-md font-bold flex flex-row items-center justify-center 
                          gap-2 t:w-fit t:px-4 transition-all"
          >
            Create Document
            <IoAdd className="text-lg" />
          </button>

          <button
            onClick={handleCanCreateFolder}
            className="border-2 border-accent-blue text-accent-blue w-full p-1.75 rounded-md font-bold flex flex-row items-center justify-center 
                          gap-2 t:w-fit t:px-4 transition-all bg-white"
          >
            Create Folder
            <IoAdd className="text-lg" />
          </button>
        </div>

        {folderId ? (
          <div className="w-full flex flex-row items-center justify-between">
            <Link
              href={`/nest/hr/document/${
                folder.path && typeof folder.path === "number" ? folder.path : 0
              }`}
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

export default HRDocument;
