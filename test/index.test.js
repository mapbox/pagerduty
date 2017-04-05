'use strict';

/* Store and set environment variables */
const originalTEST = process.env.TEST;
const originalCustomPagerDutyToken = process.env.CustomPagerDutyToken;
process.env.TEST = true;
process.env.CustomPagerDutyToken = 'test_token';

/* Initialize constants */
const fs = require('fs');
const PagerDuty = require(`${__dirname}/../index`);
const pd = new PagerDuty();
const test = require('tape');
let server, app;

/* Fixtures */
const createOverride = JSON.parse(fs.readFileSync(`${__dirname}/fixtures/createOverride.json`));
const createUser = JSON.parse(fs.readFileSync(`${__dirname}/fixtures/createUser.json`));
const getEscalationPolicy = JSON.parse(fs.readFileSync(`${__dirname}/fixtures/getEscalationPolicy.json`));
const listIncidentLogEntries = JSON.parse(fs.readFileSync(`${__dirname}/fixtures/listIncidentLogEntries.json`));
const listIncidentNotes = JSON.parse(fs.readFileSync(`${__dirname}/fixtures/listIncidentNotes.json`));
const listIncidents = JSON.parse(fs.readFileSync(`${__dirname}/fixtures/listIncidents.json`));
const listSchedules = JSON.parse(fs.readFileSync(`${__dirname}/fixtures/listSchedules.json`));
const listUsers = JSON.parse(fs.readFileSync(`${__dirname}/fixtures/listUsers.json`));
const updateUser = JSON.parse(fs.readFileSync(`${__dirname}/fixtures/updateUser.json`));

test('[pagerduty]', (t) => {
  t.test('[pagerduty] setup mock server', (assert) => {
    app = require('express')();

    app.post('/schedules/PPPPPPA/overrides', (req, res) => {
      assert.equal(req.url, '/schedules/PPPPPPA/overrides', 'expected req.url');
      res.status(201).send(createOverride);
    });

    app.post('/users', (req, res) => {
      assert.equal(req.url, '/users', 'expected req.url');
      assert.ok(req.headers.accept && req.headers.authorization && req.headers.from, 'combined default & user-provided headers');
      res.status(201).send(createUser);
    });

    app.get('/escalation_policies/PPPPPPA', (req, res) => {
      assert.equal(req.url, '/escalation_policies/PPPPPPA?offset=0&total=true&limit=100', 'expected req.url');
      res.status(200).send(getEscalationPolicy);
    });

    app.get('/escalation_policies/PPPPPPA/log_entries', (req, res) => {
      assert.equal(req.url, '/escalation_policies/PPPPPPA/log_entries?offset=0&total=true&limit=100', 'expected req.url');
      res.status(200).send(listIncidentLogEntries);
    });

    app.get('/escalation_policies/PPPPPPA/notes', (req, res) => {
      assert.equal(req.url, '/escalation_policies/PPPPPPA/notes?offset=0&total=true&limit=100', 'expected req.url');
      res.status(200).send(listIncidentNotes);
    });

    app.get('/incidents', (req, res) => {
      assert.equal(req.url, '/incidents?since=2017-04-04T13%3A00%3A00Z&time_zone=UTC&offset=0&total=true&limit=100', 'expected req.url');
      res.status(200).send(listIncidents);
    });

    app.get('/schedules', (req, res) => {
      assert.equal(req.url, '/schedules?query=cat&offset=0&total=true&limit=100', 'expected req.url');
      res.status(200).send(listSchedules);
    });

    app.get('/users', (req, res) => {
      assert.equal(req.url, '/users?query=Dev%20Null&offset=0&total=true&limit=100', 'expected req.url');
      res.status(200).send(listUsers);
    });

    app.put('/users/PPPPPPA', (req, res) => {
      assert.equal(req.url, '/users/PPPPPPA', 'expected req.url');
      res.status(200).send(updateUser);
    });

    app.delete('/users/PPPPPPA', (req, res) => {
      assert.equal(req.url, '/users/PPPPPPA', 'expected req.url');
      res.status(204).send('');
    });

    assert.end();
  });

  t.test('[pagerduty] start server', (assert) => {
    server = app.listen(3333, () => {
      assert.end();
    });
  });

  t.test('[pagerduty] [post] createOverride', (assert) => {
    pd.post({
      path: 'schedules/PPPPPPA/overrides',
      body: {
        override: {
          start: '2017-04-06T12:00:00+00:00',
          end: '2017-04-07T12:00:00+00:00',
          user: {
            id: 'PPPPPPA',
            type: 'user_reference',
            summary: 'Dev Null',
            self: 'https://api.pagerduty.com/users/PPPPPPA',
            html_url: 'https://company.pagerduty.com/users/PPPPPPA'
          }
        }
      }
    }, (err, res) => {
      assert.ifError(err, 'should not error');
      assert.deepEqual(res.body, createOverride);
      assert.end();
    });
  });

  t.test('[pagerduty] [post] createUser', (assert) => {
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
      assert.ifError(err, 'should not error');
      assert.deepEqual(res.body, createUser);
      assert.end();
    });
  });

  t.test('[pagerduty] [get] getEscalationPolicy', (assert) => {
    pd.get({
      key: 'escalation_policy',
      path: 'escalation_policies/PPPPPPA'
    }, (err, res) => {
      assert.ifError(err, 'should not error');
      assert.deepEqual(res, [getEscalationPolicy.escalation_policy], 'expected pd.get response');
      assert.end();
    });
  });

  t.test('[pagerduty] [get] listIncidentLogEntries', (assert) => {
    pd.get({
      key: 'log_entries',
      path: 'escalation_policies/PPPPPPA/log_entries'
    }, (err, res) => {
      assert.ifError(err, 'should not error');
      assert.deepEqual(res, listIncidentLogEntries.log_entries, 'expected pd.get response');
      assert.end();
    });
  });

  t.test('[pagerduty] [get] listIncidentNotes', (assert) => {
    pd.get({
      key: 'notes',
      path: 'escalation_policies/PPPPPPA/notes'
    }, (err, res) => {
      assert.ifError(err, 'should not error');
      assert.deepEqual(res, listIncidentNotes.notes, 'expected pd.get response');
      assert.end();
    });
  });

  t.test('[pagerduty] [get] listIncidents', (assert) => {
    pd.get({
      key: 'incidents',
      path: 'incidents?since=2017-04-04T13%3A00%3A00Z&time_zone=UTC'
    }, (err, res) => {
      assert.ifError(err, 'should not error');
      assert.deepEqual(res, listIncidents.incidents, 'expected pd.get response');
      assert.end();
    });
  });

  t.test('[pagerduty] [get] listSchedules', (assert) => {
    pd.get({
      key: 'schedules',
      path: 'schedules?query=cat'
    }, (err, res) => {
      assert.ifError(err, 'should not error');
      assert.deepEqual(res, listSchedules.schedules, 'expected pd.get response');
      assert.end();
    });
  });

  t.test('[pagerduty] [get] listUsers', (assert) => {
    pd.get({
      key: 'users',
      path: 'users?query=Dev%20Null'
    }, (err, res) => {
      assert.ifError(err, 'should not error');
      assert.deepEqual(res, listUsers.users, 'expected pd.get response');
      assert.end();
    });
  });

  t.test('[pagerduty] [get] listUsers, no key', (assert) => {
    pd.get({
      path: 'users?query=Dev%20Null'
    }, (err, res) => {
      assert.ifError(err, 'should not error');
      assert.deepEqual(res, [listUsers], 'expected pd.get response');
      assert.end();
    });
  });

  t.test('[pagerduty] [put] updateUsers', (assert) => {
    pd.put({
      path: 'users/PPPPPPA',
      body: {
        user: {
          description: 'Software Engineer'
        }
      }
    }, (err, res) => {
      assert.ifError(err, 'should not error');
      assert.deepEqual(res.body, updateUser, 'expected pd.put response');
      assert.end();
    });
  });

  t.test('[pagerduty] [delete] deleteUser delete', (assert) => {
    pd.delete({
      path: 'users/PPPPPPA'
    }, (err, res) => {
      assert.ifError(err, 'should not error');
      assert.deepEqual(res.body, '');
      assert.end();
    });
  });

  t.test('[pagerduty] cleanup', (assert) => {
    server.close();
    process.env.TEST = originalTEST;
    process.env.CustomPagerDutyToken = originalCustomPagerDutyToken;
    assert.end();
  });

  t.end();
});
