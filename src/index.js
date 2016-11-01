#!/usr/bin/env node
import { install } from 'source-map-support';
install();

import printer from './someModule.js';

console.log(`file path is: ${process.argv[1]}`);
console.log(`process.cwd: ${process.cwd()}`);

printer();

throw new Error('Test! ');
