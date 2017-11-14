/**
 * @fileoverview Utility functions for AST
 */
'use strict';

const LIFE_CYCLE_METHODS = ['constructor', 'componentWillReceiveProps', 'shouldComponentUpdate', 'componentWillUpdate', 'componentDidUpdate'];

/**
 * Get properties name
 * @param {Object} node - Property.
 * @returns {String} Property name.
 */
function getPropertyName(node) {
  if (node.key || ['MethodDefinition', 'Property'].indexOf(node.type) !== -1) {
    return node.key.name;
  } else if (node.type === 'MemberExpression') {
    return node.property.name;
  }
  return '';
}

/**
 * Get properties for a given AST node
 * @param {ASTNode} node The AST node being checked.
 * @returns {Array} Properties array.
 */
function getComponentProperties(node) {
  switch (node.type) {
    case 'ClassDeclaration':
    case 'ClassExpression':
      return node.body.body;
    case 'ObjectExpression':
      // return node.properties;
      return node.properties;
    default:
      return [];
  }
}

/**
 * Find a return statment in the current node
 *
 * @param {ASTNode} ASTnode The AST node being checked
 */
function findReturnStatement(node) {
  if (
    (!node.value || !node.value.body || !node.value.body.body) &&
    (!node.body || !node.body.body)
  ) {
    return false;
  }

  const bodyNodes = (node.value ? node.value.body.body : node.body.body);

  let i = bodyNodes.length - 1;
  for (; i >= 0; i--) {
    if (bodyNodes[i].type === 'ReturnStatement') {
      return bodyNodes[i];
    }
  }
  return false;
}

/**
 * Check if we are in a lifecycle method
 * @return {boolean} true if we are in a lifecycle method, false if not
 **/
function inLifeCycleMethod(context) {
  let scope = context.getScope();
  while (scope) {
    if (
      scope.block && scope.block.parent &&
      scope.block.parent.key &&
        LIFE_CYCLE_METHODS.indexOf(scope.block.parent.key.name) >= 0
    ) {
      return true;
    }
    scope = scope.upper;
  }
  return false;
}

module.exports = {
  findReturnStatement: findReturnStatement,
  getPropertyName: getPropertyName,
  getComponentProperties: getComponentProperties,
  inLifeCycleMethod: inLifeCycleMethod
};
