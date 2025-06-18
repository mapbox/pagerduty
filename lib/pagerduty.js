'use strict';
const baseUrl = process.env.TEST ? 'http://localhost:3333/' : 'https://api.pagerduty.com/';
const axios = require('axios');
const utils = require('./utils');
const axiosRetry = require('axios-retry').default;

axiosRetry(axios, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay
});

class PagerDuty {
  /**
  * Create a new PagerDuty API client.
  *
  * @param {string} [options.pagerDutyToken] - PagerDuty access token
  * @param {string} [options.timeout=10000] - number of milliseconds used for read and connection timouets
  */
  constructor (options) {
    this.token = options['pagerDutyToken'];
    this.timeout = Object.prototype.hasOwnProperty.call(options, 'timeout') ? options.timeout : 10000;
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
   * @param {string} [options.timeout] - number of milliseconds used for read and connection timouets
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
    if (!Object.prototype.hasOwnProperty.call(options, 'timeout')) options.timeout = this.timeout;

    let results = [];
    query(0);

    function query(offset) {
      axios({
        method: 'GET',
        url: utils.updateUrl(`${baseUrl}${options.path}`, offset),
        headers: {
          Accept: 'application/vnd.pagerduty+json;version=2',
          Authorization: `Token token=${options.token}`
        },
        timeout: options.timeout,
        transitional: {
          clarifyTimeoutError: true
        }
      })
        .then((res) => {
          const body = res.data;
          if (res.status !== 200) return callback(`HTTP status code ${res.status}: ${JSON.stringify(body)}`);
          results = options.key ? results.concat(body[options.key]) : results.concat(body);
          if (body.more) {
            offset += body.limit;
            query(offset);
          } else {
            return callback(null, results);
          }
        })
        .catch((err) => {
          if (err.response) {
            return callback(`HTTP status code ${err.response.status}: ${JSON.stringify(err.response.data)}`);
          }
          return callback(err);
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
   * @param {string} [options.timeout] - number of milliseconds used for read and connection timouets
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
    if (!Object.prototype.hasOwnProperty.call(options, 'timeout')) options.timeout = this.timeout;

    let headers = {
      Accept: 'application/vnd.pagerduty+json;version=2',
      Authorization: `Token token=${options.token}`
    };
    headers = Object.assign(headers, options.headers);

    axios({
      method: 'POST',
      url: `${baseUrl}${options.path}`,
      headers: headers,
      data: options.body,
      timeout: options.timeout,
      transitional: {
        clarifyTimeoutError: true
      }
    })
      .then((res) => {
        if (res.status !== 201) return callback(`HTTP status code ${res.status}: ${JSON.stringify(res.data)}`);
        return callback(null, { body: res.data });
      })
      .catch((err) => {
        if (err.response) {
          return callback(`HTTP status code ${err.response.status}: ${JSON.stringify(err.response.data)}`);
        }
        return callback(err);
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
   * @param {string} [options.timeout] - number of milliseconds used for read and connection timouets
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
    if (!Object.prototype.hasOwnProperty.call(options, 'timeout')) options.timeout = this.timeout;

    let headers = {
      Accept: 'application/vnd.pagerduty+json;version=2',
      Authorization: `Token token=${options.token}`
    };
    headers = Object.assign(headers, options.headers);

    axios({
      method: 'PUT',
      url: `${baseUrl}${options.path}`,
      headers: headers,
      data: options.body,
      timeout: options.timeout,
      transitional: {
        clarifyTimeoutError: true
      }
    })
      .then((res) => {
        if (res.status !== 200) return callback(`HTTP status code ${res.status}: ${JSON.stringify(res.data)}`);
        return callback(null, { body: res.data });
      })
      .catch((err) => {
        if (err.response) {
          return callback(`HTTP status code ${err.response.status}: ${JSON.stringify(err.response.data)}`);
        }
        return callback(err);
      });
  }

  /**
   * Make a DELETE request to the PagerDuty API. The PagerDuty access token can
   * be provided explicitly.
   *
   * @name delete
   * @param {string} options.path - URL path and query
   * @param {string} [options.token] - PagerDuty access token
   * @param {string} [options.timeout] - number of milliseconds used for read and connection timouets
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
    if (!Object.prototype.hasOwnProperty.call(options, 'timeout')) options.timeout = this.timeout;

    axios({
      method: 'DELETE',
      url: `${baseUrl}${options.path}`,
      headers: {
        Accept: 'application/vnd.pagerduty+json;version=2',
        Authorization: `Token token=${options.token}`
      },
      timeout: options.timeout,
      transitional: {
        clarifyTimeoutError: true
      }
    })
      .then((res) => {
        if (res.status !== 204) return callback(`HTTP status code ${res.status}: ${JSON.stringify(res.data)}`);
        return callback(null, { body: res.data });
      })
      .catch((err) => {
        if (err.response) {
          return callback(`HTTP status code ${err.response.status}: ${JSON.stringify(err.response.data)}`);
        }
        return callback(err);
      });
  }
}

module.exports = PagerDuty;
