[![Build Status](https://travis-ci.com/mapbox/pagerduty.svg?branch=master)](https://travis-ci.com/mapbox/pagerduty)

# pagerduty

A Node.js SDK for the PagerDuty v2 API

## API

First, create a new PagerDuty SDK object. A PagerDuty API token that will be used by default for all methods can be included by specifying the `pagerDutyToken` option.

**Parameters**

-   `options.pagerDutyToken` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** PagerDuty access token
-   `options.timeout` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)?** number of milliseconds used for read and connection timouets - defaults to 10 seconds if not specified


**Example**

```javascript
const PagerDuty = require('@mapbox/pagerduty');
const pd = new PagerDuty({
  pagerDutyToken: process.env.API_TOKEN
});

pd.get({
  path: 'services'
  ...
```

<!-- Generated, in part, by documentation.js. Update this documentation by updating the source code. -->

- [get](#get)
- [post](#post)
- [put](#put)
- [delete](#delete)

### get

Make a GET request to the PagerDuty API. You can choose to receive a specific
response body property by specifying an `options.key`; otherwise, the entire
response body will be returned. The PagerDuty access token can be provided
explicitly.

**Parameters**

-   `options.path` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** URL path and query
-   `options.key` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)?** Response body property to return
-   `options.token` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)?** PagerDuty access token
-   `options.timeout` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)?** number of milliseconds used for read and connection timouets

**Example**

```javascript
const PagerDuty = require('@mapbox/pagerduty');
const pd = new PagerDuty();
const id = 'PPPPPPA';
pd.get({
  path: `users/${id}`,
  key: 'user'
}, (err, res) => {
  if (err) throw err;
  console.log(`Successfully fetched ${res[0].name} with ID ${id}.`);
});
```

### post

Make a POST request to the PagerDuty API. The PagerDuty access token can be
provided explicitly.

**Parameters**

-   `options.path` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** URL path and query
-   `options.body` **[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** POST request body
-   `options.headers` **[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)?** Additional headers, excluding `Accept`
    and `Authorization`
-   `options.token` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)?** PagerDuty access token
-   `options.timeout` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)?** number of milliseconds used for read and connection timouets

**Example**

```javascript
const PagerDuty = require('@mapbox/pagerduty');
const pd = new PagerDuty();
pd.post({
  path: 'users',
  body: {
    user: {
      type: 'user',
      name: 'Dev Null',
      email: 'devnull@company.com',
      time_zone: 'America/New_York',
      color: 'blue-violet',
      role: 'user'
    }
  },
  headers: {
    From: 'anotherdevnull@company.com'
  }
}, (err, res) => {
  if (err) throw err;
  console.log(`Created ${res.body.user.summary} with ID ${res.body.user.id}.`);
});
```

### put

Make a PUT request to the PagerDuty API. The PagerDuty access token can be
provided explicitly.

**Parameters**

-   `options.path` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** URL path and query
-   `options.body` **[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** PUT request body
-   `options.headers` **[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)?** Additional headers, excluding `Accept`
    and `Authorization`
-   `options.token` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)?** PagerDuty access token
-   `options.timeout` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)?** number of milliseconds used for read and connection timouets

**Example**

```javascript
const PagerDuty = require('@mapbox/pagerduty');
const pd = new PagerDuty();
const id = 'PPPPPPA';
pd.put({
  path: `users/${id}`,
  body: {
    user: {
      job_title: 'Software Engineer'
    }
  }
}, (err, res) => {
  if (err) throw err;
  console.log(`Successfully updated ${res.body.user.name}'s user description to ${res.body.user.description}`);
});
```

### delete

Make a DELETE request to the PagerDuty API. The PagerDuty access token can
be provided explicitly.

**Parameters**

-   `options.path` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** URL path and query
-   `options.token` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)?** PagerDuty access token
-   `options.timeout` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)?** number of milliseconds used for read and connection timouets

**Example**

```javascript
const PagerDuty = require('@mapbox/pagerduty');
const pd = new PagerDuty();
const id = 'PPPPPPA';
pd.delete({
  path: `users/${id}`
}, (err, res) => {
  if (err) throw err;
  console.log(`Successfully deleted user ID ${id}.`);
});
```
