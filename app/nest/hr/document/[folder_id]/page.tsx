"use client";

import DocumentCard from "@/src/components/global/document/DocumentCard";
import FolderCard from "@/src/components/global/document/FolderCard";
import ShowDocument from "@/src/components/global/document/ShowDocument";
import Filter from "@/src/components/global/filter/Filter";
import CreateDocument from "@/src/components/hr/document/CreateDocument";
import CreateFolder from "@/src/components/hr/document/CreateFolder";
import EditDocument from "@/src/components/hr/document/EditDocument";
import EditFolder from "@/src/components/hr/document/EditFolder";
import useCategory from "@/src/hooks/useCategory";

import useSearch from "@/src/hooks/useSearch";
import useSort from "@/src/hooks/useSort";
import {
  FolderInterface,
  DocumentInterface,
} from "@/src/interface/DocumentInterface";
import { UserInterface } from "@/src/interface/UserInterface";
import {
  HR_DOCUMENTS_CATEGORY,
  HR_DOCUMENTS_SEARCH,
  HR_DOCUMENTS_SORT,
  HR_FOLDERS_SEARCH,
} from "@/src/utils/filters";
import axios from "axios";

import DeleteEntity from "@/src/components/global/entity/DeleteEntity";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useParams } from "next/navigation";
import React from "react";
import { IoAdd, IoArrowBack } from "react-icons/io5";

const HRDocument = () => {
  const [canCreateDocument, setCanCreateDocument] = React.useState(false);
  const [folder, setFolder] = React.useState<FolderInterface>({
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
      (DocumentInterface & UserInterface) | (FolderInterface & UserInterface)
    >
  >([]);
  const [canEditDocument, setCanEditDocument] = React.useState(false);
  const [canDeleteDocument, setCanDeleteDocument] = React.useState(false);
  const [canEditFolder, setCanEditFolder] = React.useState(false);
  const [canDeleteFolder, setCanDeleteFolder] = React.useState(false);
  const [activeDocumentSeeMore, setActiveDocumentSeeMore] = React.useState(0);

  const {
    canSeeSearchDropDown,
    search,
    handleCanSeeSearchDropDown,
    handleSearch,
    handleSelectSearch,
  } = useSearch("name", "Name");

  const {
    category,
    canSeeCategoryDropDown,
    handleCanSeeCategoryDropDown,
    handleSelectCategory,
  } = useCategory("", "all", "All");
  const {
    sort,
    canSeeSortDropDown,
    handleCanSeeSortDropDown,
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
      if (user?.token) {
        const {
          data: { documents },
        } = await axios.get(`${url}/hr/document`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
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
      if (user?.token && folderId) {
        const { data: folderDetails } = await axios.get(
          `${url}/hr/folder/${folderId}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
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
      <DocumentCard
        role={user?.role as string}
        key={index}
        activeMenu={activeMenu}
        createdBy={createdBy}
        //
        id={document.id}
        name={document.name}
        created_by={document.created_by}
        path={document.path}
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
        handleActiveMenu={() =>
          document.id && handleActiveDocumentMenu(type, document.id)
        }
        handleCanDelete={handleCanDeleteDocument}
        handleCanEdit={handleCanEditDocument}
        handleActiveSeeMore={() =>
          document.id && handleActiveDocumentSeeMore(document.id)
        }
      />
    ) : (
      <FolderCard
        role={user?.role as string}
        key={index}
        activeMenu={activeMenu}
        createdBy={createdBy}
        //
        id={document.id}
        name={document.name}
        created_by={document.created_by}
        path={document.path}
        //
        first_name={document.first_name}
        last_name={document.last_name}
        email={document.email}
        email_verified_at={document.email_verified_at}
        user_id={document.user_id}
        //
        handleActiveMenu={() =>
          document.id && handleActiveDocumentMenu(type, document.id)
        }
        handleCanDelete={handleCanDeleteFolder}
        handleCanEdit={handleCanEditFolder}
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
      {canCreateDocument ? (
        <CreateDocument
          toggleModal={handleCanCreateDocument}
          refetchIndex={getDocuments}
        />
      ) : null}

      {canCreateFolder ? (
        <CreateFolder
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
        <DeleteEntity
          route="document"
          label="Document"
          id={activeDocumentMenu.id}
          toggleModal={handleCanDeleteDocument}
          refetchIndex={getDocuments}
        />
      ) : null}

      {canDeleteFolder ? (
        <DeleteEntity
          route="folder"
          label="Folder"
          id={activeDocumentMenu.id}
          toggleModal={handleCanDeleteFolder}
          refetchIndex={getDocuments}
        />
      ) : null}

      {activeDocumentSeeMore ? (
        <ShowDocument
          id={activeDocumentSeeMore}
          toggleModal={() => handleActiveDocumentSeeMore(0)}
        />
      ) : null}

      <div
        className="w-full flex flex-col items-center justify-start max-w-(--breakpoint-l-l) p-2
          t:items-start t:p-4 gap-4 t:gap-8"
      >
        <Filter
          searchKeyLabelPairs={
            category.categoryValue === "all" ||
            category.categoryValue === "documents"
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
            categoryValue: category.categoryValue,
            categoryLabel: category.categoryLabel,
            canSeeCategoryDropDown: canSeeCategoryDropDown,
            toggleCanSeeCategoryDropDown: handleCanSeeCategoryDropDown,
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
