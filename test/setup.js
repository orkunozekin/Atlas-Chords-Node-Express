process.env.NODE_ENV = 'test'

require('dotenv').config()

process.env.TEST_DB_URL = process.env.TEST_DB_URL || "postgresql://postgres@localhost/atlas-chords_test"

const supertest = require('supertest');
const { expect } = require('chai');

global.supertest = supertest;
global.expect = expect;