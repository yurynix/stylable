import * as chai from "chai";
import { generateStylableOutput } from "../utils/generate-test-util";
const expect = chai.expect;

describe('emit-css: general', () => {

    describe('used files', () => {

        it('should output as bundle (one file)', () => {
            const output = generateStylableOutput({
                entry: '/entry.st.css',
                usedFiles: [
                    '/entry.st.css'
                ],
                files: {
                    "/entry.st.css": {
                        namespace: 'entry',
                        content: `
                            .b { color:green; } 
                        `
                    }
                }
            });

            expect(output).to.eql(`.entry--root .entry--b { color:green; }`);
        });
        it.only('should inline mixins', () => {
            const output = generateStylableOutput({
                entry: '/entry.st.css',
                usedFiles: [
                    '/entry.st.css'
                ],
                files: {
                    "/mixin.js": {
                        namespace: 'entry',
                        content: `
                            module.exports = function(cols,rows){
                                return {
                                    gridTemplateCols:cols,
                                    gridTemplateRows:rows
                                }
                            }
                        `
                    },
                    "/entry.st.css": {
                        namespace: 'entry',
                        content: `
                            :import{
                                -st-from:'./mixin.js';
                                -st-default:mixin;
                            }
                            .b { -st-mixin:mixin(auto, 1fr); } 
                        `
                    }
                }
            });

            expect(output).to.eql(`.entry--root .entry--b { grid-template-cols: auto; grid-template-rows: 1fr; }`);
        });

        it('should output multiple files', () => {
            const output = generateStylableOutput({
                entry: '/entry.st.css',
                usedFiles: [
                    '/entry.st.css',
                    '/comp.st.css'
                ],
                files: {
                    "/entry.st.css": {
                        namespace: 'entry',
                        content: `
                            .a { color:red; } 
                        `
                    },
                    "/comp.st.css": {
                        namespace: 'comp',
                        content: `
                            .b { color:green; } 
                        `
                    }
                }

            });

            expect(output).to.eql([
                `.comp--root .comp--b { color:green; }`,
                `.entry--root .entry--a { color:red; }`
            ].join('\n'));
        });

        it('should not output unused files and selectors containing them even when imported through CSS', () => {
            const output = generateStylableOutput({
                entry: '/entry.st.css',
                usedFiles: [
                    '/entry.st.css'
                ],
                files: {
                    "/entry.st.css": {
                        namespace: 'entry',
                        content: `
                            :import {
                                -st-from: './comp.st.css';
                                -st-default: Comp;
                            }
                            Comp { color:blue; }
                            .a { 
                                -st-extends: Comp;
                                color:red; 
                            }
                            .b .a { color: green; }
                            .b Comp { color: salmon; }
                            .b { color:gold; }
                        `
                    },
                    "/comp.st.css": {
                        namespace: 'comp',
                        content: `
                            .b { color:green; } 
                        `
                    }
                }

            });

            expect(output).to.eql([
                `.entry--root .entry--b { color:gold; }`
            ].join('\n'));
        });

    });

})
