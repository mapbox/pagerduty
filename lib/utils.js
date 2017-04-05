'use strict';

const querystring = require('querystring');
const url = require('url');

/**
 * A function that updates the URL for a GET request. This function checks if `offset`,
 * `total`, or `limit` have been provided in the querystring. If so, it uses the
 * provided values. If not, it uses default values.
 *
 * @name updateUrl
 * @param {string} address - The URL for a GET request.
 * @param {string} offset - The current offset value for response pagination.
 */
module.exports.updateUrl = updateUrl;
function updateUrl(address, offset) {
  const parsed = url.parse(address);
  const query = parsed.query;
  const qs = querystring.parse(query);

  if (!qs.hasOwnProperty('offset')) qs.offset = offset;
  if (!qs.hasOwnProperty('total')) qs.total = true;
  if (!qs.hasOwnProperty('limit')) qs.limit = 100;

  parsed.search = `?${querystring.stringify(qs)}`;
  const formatted = url.format(parsed);
  return formatted;
}
