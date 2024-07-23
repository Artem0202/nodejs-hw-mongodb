import { contactsCollection } from '../db/models/contactModel.js';
import { calcPaginationData } from '../utils/calcPaginationData.js';
import { fieldList, sortOrderList } from '../constants/index.js';

export const getAllContacts = async ({
  filter,
  page,
  perPage,
  sortBy = fieldList[0],
  sortOrder = sortOrderList[0],
}) => {
  const skip = (page - 1) * perPage;
  const dataBaseQuery = contactsCollection.find();
  if (filter.userId) {
    dataBaseQuery.where('userId').equals(filter.userId);
  }
  if (filter.contactType) {
    dataBaseQuery.where('contactType').equals(filter.contactType);
  }
  if (filter.isFavourite) {
    dataBaseQuery.where('isFavourite').equals(filter.isFavourite);
  }

  const totalContacts = await contactsCollection.find().merge(dataBaseQuery).countDocuments();
  const data = await dataBaseQuery
    .skip(skip)
    .limit(perPage)
    .sort({ [sortBy]: sortOrder })
    .exec();

  const { totalPages, hasNextPage, hasPreviousPage } = calcPaginationData({
    total: totalContacts,
    page,
    perPage,
  });

  return {
    data,
    page,
    perPage,
    totalContacts,
    totalPages,
    hasNextPage,
    hasPreviousPage,
  };
};

export const getContactById = (contactId) => contactsCollection.findOne(contactId);

export const createContact = (data) => contactsCollection.create(data);

export const upsertContact = async (contactId, payload = {}, userId) => {
  const updateOptions = { new: true, includeResultMetadata: true };

  const rawResult = await contactsCollection.findOneAndUpdate(
    { _id: contactId, userId },
    payload,
    updateOptions,
  );

  if (!rawResult || !rawResult.value) return null;

  return {
    data: rawResult.value,
    isNew: Boolean(rawResult?.lastErrorObject?.upsert),
  };
};

export const deleteContact = (filter) => contactsCollection.findOneAndDelete(filter);
