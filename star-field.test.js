import test from 'node:test';
import assert from 'node:assert/strict';
import {fieldForActs,STAR_STYLE} from './star-field.js';
test('the sphere grows beyond seven acts while brightness stays bounded',()=>{
 let prev=fieldForActs(0);assert.equal(prev.steps,0);assert.ok(prev.radius<.1);
 for(const n of [1,2,7,8,30,100,10000]){const f=fieldForActs(n);assert.ok(f.radius>prev.radius);assert.ok(f.energy>=prev.energy&&f.energy<=1);prev=f;}
});
test('deleting a ray can reduce the field without changing its style',()=>{
 const palette=JSON.stringify(STAR_STYLE);assert.ok(fieldForActs(3).radius<fieldForActs(7).radius);assert.equal(JSON.stringify(STAR_STYLE),palette);
});
test('empty and invalid counts produce a finite seed',()=>{
 for(const n of [-1,null,NaN,Infinity,'bad'])assert.deepEqual(fieldForActs(n),fieldForActs(0));
});
