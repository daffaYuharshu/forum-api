const InvariantError = require('./InvariantError');
const AuthenticationError = require('./AuthenticationError');

const DomainErrorTranslator = {
  translate(error) {
    return DomainErrorTranslator._directories[error.message] || error;
  },
};

DomainErrorTranslator._directories = {
  'REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
    'tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada',
  ),
  'REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
    'tidak dapat membuat user baru karena tipe data tidak sesuai',
  ),
  'REGISTER_USER.USERNAME_LIMIT_CHAR': new InvariantError(
    'tidak dapat membuat user baru karena karakter username melebihi batas limit',
  ),
  'REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER': new InvariantError(
    'tidak dapat membuat user baru karena username mengandung karakter terlarang',
  ),
  'USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
    'harus mengirimkan username dan password',
  ),
  'USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
    'username dan password harus string',
  ),
  'REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN':
    new InvariantError('harus mengirimkan token refresh'),
  'REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION':
    new InvariantError('refresh token harus string'),
  'DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN':
    new InvariantError('harus mengirimkan token refresh'),
  'DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION':
    new InvariantError('refresh token harus string'),
  'ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
    'tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada',
  ),
  'ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
    'tidak dapat membuat thread baru karena tipe data tidak sesuai',
  ),
  'ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
    'tidak dapat membuat komentar baru karena properti yang dibutuhkan tidak ada',
  ),
  'ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
    'tidak dapat membuat komentar baru karena tipe data tidak sesuai',
  ),
  'ADD_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PARAMETER': new InvariantError(
    'tidak dapat membuat komentar baru karena parameter yang dibutuhkan tidak ada',
  ),
  'ADD_COMMENT_USE_CASE.PARAMETER_NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
    'tidak dapat membuat komentar baru karena tipe data tidak sesuai',
  ),
  'DELETE_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PARAMETER': new InvariantError(
    'tidak dapat menghapus komentar karena parameter yang dibutuhkan tidak ada',
  ),
  'DELETE_COMMENT_USE_CASE.PARAMETER_NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
    'tidak dapat menghapus komentar karena tipe data tidak sesuai',
  ),
  'ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
    'tidak dapat membuat balasan baru karena properti yang dibutuhkan tidak ada',
  ),
  'ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
    'tidak dapat membuat balasan baru karena tipe data tidak sesuai',
  ),
  'ADD_REPLY_USE_CASE.NOT_CONTAIN_NEEDED_PARAMETER': new InvariantError(
    'tidak dapat membuat balasan baru karena parameter yang dibutuhkan tidak ada',
  ),
  'ADD_REPLY_USE_CASE.PARAMETER_NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
    'tidak dapat membuat balasan baru karena tipe data tidak sesuai',
  ),
  'Missing authentication': new AuthenticationError('Missing authentication'),
};

module.exports = DomainErrorTranslator;
