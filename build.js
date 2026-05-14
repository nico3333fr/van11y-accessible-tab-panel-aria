#!/usr/bin/env node
/*
 * Build script for van11y-accessible-tab-panel-aria.
 *
 * Replaces the previous gulp-based pipeline while keeping the exact same
 * output files in `dist/`:
 *   - dist/<name>.es6.js     (copy of the ES2015 source)
 *   - dist/<name>.js         (ES5 transpilation)
 *   - dist/<name>.min.js     (minified ES5 with banner)
 *
 * Usage:
 *   node build.js          # default: same as the old `gulp` task
 *   node build.js --es5    # same as the old `gulp es5` task
 */

'use strict';

const fs = require('fs');
const path = require('path');
const babel = require('@babel/core');
const { minify } = require('terser');

const pkg = require('./package.json');

const ROOT = __dirname;
const SRC_DIR = path.join(ROOT, 'src');
const DIST_DIR = path.join(ROOT, 'dist');

const BANNER = [
    '/**',
    ` * ${pkg.name} - ${pkg.description}`,
    ` * @version v${pkg.version}`,
    ` * @link ${pkg.homepage}`,
    ` * @license ${pkg.license} : https://github.com/nico3333fr/van11y-accessible-tab-panel-aria/blob/master/LICENSE`,
    ' */',
    ''
].join('\n');

const BABEL_OPTIONS = {
    babelrc: false,
    configFile: false,
    compact: false,
    presets: [
        [require.resolve('@babel/preset-env'), {
            targets: { ie: '9' },
            modules: false,
            loose: true
        }]
    ]
};

function ensureDir(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

function listFiles(dir, predicate) {
    if (!fs.existsSync(dir)) return [];
    return fs.readdirSync(dir).filter(predicate);
}

async function transpileEs6Files() {
    const files = listFiles(SRC_DIR, (f) => f.endsWith('.es6.js'));

    for (const file of files) {
        const srcPath = path.join(SRC_DIR, file);
        const baseName = file.replace(/\.es6\.js$/, '');
        const source = fs.readFileSync(srcPath, 'utf8');

        const { code } = await babel.transformAsync(source, BABEL_OPTIONS);

        const jsPath = path.join(DIST_DIR, `${baseName}.js`);
        fs.writeFileSync(jsPath, code);
        console.log(`  wrote ${path.relative(ROOT, jsPath)}`);

        const minified = await minify(code, {
            output: { comments: false }
        });
        if (minified.error) throw minified.error;

        const minPath = path.join(DIST_DIR, `${baseName}.min.js`);
        fs.writeFileSync(minPath, BANNER + minified.code);
        console.log(`  wrote ${path.relative(ROOT, minPath)}`);
    }
}

async function copyAndMinifyPlainJsFiles() {
    const files = listFiles(
        SRC_DIR,
        (f) => f.endsWith('.js') && !f.endsWith('.es6.js')
    );

    for (const file of files) {
        const srcPath = path.join(SRC_DIR, file);
        const baseName = file.replace(/\.js$/, '');
        const source = fs.readFileSync(srcPath, 'utf8');

        const jsPath = path.join(DIST_DIR, file);
        fs.writeFileSync(jsPath, source);
        console.log(`  wrote ${path.relative(ROOT, jsPath)}`);

        const minified = await minify(source, {
            output: { comments: false }
        });
        if (minified.error) throw minified.error;

        const minPath = path.join(DIST_DIR, `${baseName}.min.js`);
        fs.writeFileSync(minPath, BANNER + minified.code);
        console.log(`  wrote ${path.relative(ROOT, minPath)}`);
    }
}

function copyEs6SourcesToDist() {
    const files = listFiles(SRC_DIR, (f) => f.endsWith('.es6.js'));
    for (const file of files) {
        const srcPath = path.join(SRC_DIR, file);
        const destPath = path.join(DIST_DIR, file);
        fs.copyFileSync(srcPath, destPath);
        console.log(`  wrote ${path.relative(ROOT, destPath)}`);
    }
}

async function main() {
    const onlyEs5 = process.argv.includes('--es5');

    ensureDir(DIST_DIR);

    console.log(onlyEs5 ? 'Building (es5 only)…' : 'Building…');

    await transpileEs6Files();

    if (!onlyEs5) {
        await copyAndMinifyPlainJsFiles();
        copyEs6SourcesToDist();
    }

    console.log('Done.');
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
