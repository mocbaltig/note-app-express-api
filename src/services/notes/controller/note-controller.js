import {
  InvariantError,
  NotFoundError,
  AuthorizationError,
} from '../../../exceptions/index.js';
import response from '../../../utils/response.js';

import NoteRepositories from '../repository/note-repositories.js';

export const createNote = async (req, res, next) => {
  const { title, tags, body } = req.validated;
  const { id: owner } = req.user;

  const note = await NoteRepositories.createNote({
    title,
    body,
    tags,
    owner,
  });

  if (!note) {
    return next(new InvariantError('Catatan gagal ditambahkan'));
  }

  return response(res, 201, 'Catatan berhasil ditambahkan', {
    noteId: note.id,
  });
};

export const getNotes = async (req, res) => {
  // const { title = '' } = req.query;
  // if (title !== '') {
  //   const note = await NoteRepositories.getNotes(title);
  //   return response(res, 200, 'success', { notes: note });
  // }
  const { id: owner } = req.user;
  const notes = await NoteRepositories.getNotes(owner);
  return response(res, 200, 'success', { notes });
};

export const getNoteById = async (req, res, next) => {
  const { id } = req.params;

  const { id: owner } = req.user;
  const isOwner = await NoteRepositories.verifyNoteOwner(id, owner);
  if (!isOwner) {
    return next(new AuthorizationError('Anda tidak berhak mengakses resource ini'));
  }

  const note = await NoteRepositories.getNoteById(id);

  if (!note) {
    return next(new NotFoundError('Catatan tidak ditemukan'));
  }

  return response(res, 200, 'Catatan sukses ditampilkan', { note });
};

export const editNoteById = async (req, res, next) => {
  const { id } = req.params;
  const { title, tags, body } = req.validated;

  const { id: owner } = req.user;
  const isOwner = await NoteRepositories.verifyNoteOwner(id, owner);
  if (!isOwner) {
    return next(new AuthorizationError('Anda tidak berhak mengakses resource ini'));
  }

  const note = await NoteRepositories.editNoteById({
    id,
    title,
    body,
    tags,
  });

  if (!note) {
    return next(new NotFoundError('Catatan tidak ditemukan'));
  }

  return response(res, 200, 'Catatan berhasil diperbarui', note);
};

export const deleteNoteById = async (req, res, next) => {
  const { id } = req.params;

  const { id: owner } = req.user;
  const isOwner = await NoteRepositories.verifyNoteOwner(id, owner);
  if (!isOwner) {
    return next(new AuthorizationError('Anda tidak berhak mengakses resource ini'));
  }

  const deletedNote = await NoteRepositories.deleteNoteById(id);

  if (!deletedNote) {
    return next(new NotFoundError('Catatan tidak ditemukan'));
  }

  return response(res, 200, 'Catatan berhasil dihapus', deletedNote);
};
