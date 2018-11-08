'use strict';
const baseUrl = process.env.TEST ? 'http://localhost:3333/' : 'https://api.pagerduty.com/';
const request = require('request');
const utils = require('./utils');

class PagerDuty {
  /**
  * Create a new PagerDuty API client.
  *
  * @param {string} options.pagerDutyToken - optional PagerDuty access token
  */
  constructor (options) {
    this.token = options['pagerDutyToken'];
  }

  /**
   * Make a GET request to the PagerDuty API. You can choose to receive a specific
   * response body property by specifying an `options.key`; otherwise, the entire
   * response body will be returned. The PagerDuty access token can be provided
   * explicitly.
   *
   * @name get
   * @param {string} options.path - URL path and query
   * @param {string} [options.key] - Response body property to return
   * @param {string} [options.token] - PagerDuty access token
   *
   * @example
   * const PagerDuty = require('@mapbox/pagerduty');
   * const pd = new PagerDuty();
   * const id = 'PPPPPPA';
   * pd.get({
   *   path: `users/${id}`,
   *   key: 'user'
   * }, (err, res) => {
   *   if (err) throw err;
   *   console.log(`Successfully fetched ${res[0].name} with ID ${id}.`);
   * });
   */
  get (options, callback) {
    if (!options.path) return callback(new Error('Must provide options.path'));
    if (!options['token'] && !this['token']) return callback(new Error('Must provide PagerDuty access token'));
    if (!options['token']) options.token = this.token;

    let results = [];
    query(0);

    function query(offset) {
      request({
        method: 'GET',
        url: utils.updateUrl(`${baseUrl}${options.path}`, offset),
        json: true,
        headers: {
          Accept: 'application/vnd.pagerduty+json;version=2',
          Authorization: `Token token=${options.token}`
        }
      }, (err, res, body) => {
        if (err) return callback(err);
        if (res.statusCode !== 200) return callback(`HTTP status code ${res.statusCode}: ${res.body.error.errors[0]}`);

        results = options.key ? results.concat(body[options.key]) : results.concat(body);
        if (body.more) {
          offset += body.limit;
          query(offset);
        } else {
          return callback(null, results);
        }
      });
    }
  }

  /**
   * Make a POST request to the PagerDuty API. The PagerDuty access token can be
   * provided explicitly.
   *
   * @name post
   * @param {string} options.path - URL path and query
   * @param {object} options.body - POST request body
   * @param {object} [options.headers] - Additional headers, excluding `Accept`
   * and `Authorization`
   * @param {string} [options.token] - PagerDuty access token
   *
   * @example
   * const PagerDuty = require('@mapbox/pagerduty');
   * const pd = new PagerDuty();
   * pd.post({
   *   path: 'users',
   *   body: {
   *     user: {
   *       type: 'user',
   *       name: 'Dev Null',
   *       email: 'devnull@company.com',
   *       time_zone: 'America/New_York',
   *       color: 'blue-violet',
   *       role: 'user'
   *     }
   *   },
   *   headers: {
   *     From: 'anotherdevnull@company.com'
   *   }
   * }, (err, res) => {
   *   if (err) throw err;
   *   console.log(`Created ${res.body.user.summary} with ID ${res.body.user.id}.`);
   * });
   */
  post (options, callback) {
    if (!options.path) return callback(new Error('Must provide options.path'));
    if (!options.body) return callback(new Error('Must provide options.body'));
    if (!options['token'] && !this['token']) return callback(new Error('Must provide PagerDuty access token'));
    if (!options['token']) options.token = this.token;

    let headers = {
      Accept: 'application/vnd.pagerduty+json;version=2',
      Authorization: `Token token=${options.token}`
    };
    headers = Object.assign(headers, options.headers);

    request({
      method: 'POST',
      url: `${baseUrl}${options.path}`,
      headers: headers,
      json: options.body
    }, (err, res) => {
      if (err) return callback(err);
      if (res.statusCode !== 201) return callback(`HTTP status code ${res.statusCode}: ${res.body.error.errors[0]}`);
      return callback(null, res);
    });
  }

  /**
   * Make a PUT request to the PagerDuty API. The PagerDuty access token can be
   * provided explicitly.
   *
   * @name put
   * @param {string} options.path - URL path and query
   * @param {object} options.body - PUT request body
   * @param {object} [options.headers] - Additional headers, excluding `Accept`
   * and `Authorization`
   * @param {string} [options.token] - PagerDuty access token
   *
   * @example
   * const PagerDuty = require('@mapbox/pagerduty');
   * const pd = new PagerDuty();
   * const id = 'PPPPPPA';
   * pd.put({
   *   path: `users/${id}`,
   *   body: {
   *     user: {
   *       job_title: 'Software Engineer'
   *     }
   *   }
   * }, (err, res) => {
   *   if (err) throw err;
   *   console.log(`Successfully updated ${res.body.user.name}'s user description to ${res.body.user.description}`);
   * });
   */
  put (options, callback) {
    if (!options.path) return callback(new Error('Must provide options.path'));
    if (!options.body) return callback(new Error('Must provide options.body'));
    if (!options['token'] && !this['token']) return callback(new Error('Must provide PagerDuty access token'));
    if (!options['token']) options.token = this.token;

    let headers = {
      Accept: 'application/vnd.pagerduty+json;version=2',
      Authorization: `Token token=${options.token}`
    };
    headers = Object.assign(headers, options.headers);

    request({
      method: 'PUT',
      url: `${baseUrl}${options.path}`,
      headers: headers,
      json: options.body
    }, (err, res) => {
      if (err) return callback(err);
      if (res.statusCode !== 200) return callback(`HTTP status code ${res.statusCode}: ${res.body.error.errors[0]}`);
      return callback(null, res);
    });
  }

  /**
   * Make a DELETE request to the PagerDuty API. The PagerDuty access token can
   * be provided explicitly.
   *
   * @name delete
   * @param {string} options.path - URL path and query
   * @param {string} [options.token] - PagerDuty access token
   *
   * @example
   * const PagerDuty = require('@mapbox/pagerduty');
   * const pd = new PagerDuty();
   * const id = 'PPPPPPA';
   * pd.delete({
   *   path: `users/${id}`
   * }, (err, res) => {
   *   if (err) throw err;
   *   console.log(`Successfully deleted user ID ${id}.`);
   * });
   */
  delete (options, callback) {
    if (!options.path) return callback(new Error('Must provide options.path'));
    if (!options['token'] && !this['token']) return callback(new Error('Must provide PagerDuty access token'));
    if (!options['token']) options.token = this.token;

    request({
      method: 'DELETE',
      url: `${baseUrl}${options.path}`,
      headers: {
        Accept: 'application/vnd.pagerduty+json;version=2',
        Authorization: `Token token=${options.token}`
      }
    }, (err, res) => {
      if (err) return callback(err);
      if (res.statusCode !== 204) return callback(`HTTP status code ${res.statusCode}: ${res.body.error.errors[0]}`);
      return callback(null, res);
    });
  }
}

module.exports = PagerDuty;
