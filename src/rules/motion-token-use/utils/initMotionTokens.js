/**
 * Copyright IBM Corp. 2016, 2020
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import postcss from "postcss";
import scss from "postcss-scss";
import fs from "fs";
import path from "path";

const motionTokens = [];

const nodeModulesIndex = __dirname.indexOf("/node_modules/");
const nodeModulesPath =
  nodeModulesIndex > -1
    ? __dirname.substr(0, nodeModulesIndex + 14)
    : path.join(__dirname, "../../../../node_modules/");

const layoutFile = path.join(
  nodeModulesPath,
  "carbon-components/src/globals/scss/_motion.scss"
);

const scssFromFile = fs.readFileSync(layoutFile, "utf8");

const result = postcss().process(`${scssFromFile}`, {
  from: `${layoutFile}`,
  syntax: scss,
  stringifier: scss.stringify,
});

result.root.walkDecls((decl) => {
  // matches form $duration--speed-nn
  if (/^\$duration--([a-z]*)(-[0-9]{2})*/.test(decl.prop)) {
    motionTokens.push(decl.prop);
  }
});

// permitted carbon motion functions
const motionFunctions = ["motion", "carbon--motion"];

export { motionTokens, motionFunctions };
