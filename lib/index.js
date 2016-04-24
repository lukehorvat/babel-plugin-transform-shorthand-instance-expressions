export default function({ types: t }) {
  return {
    visitor: {
      ShorthandInstanceExpression(path) {
        let {node} = path;
        let {expression} = node;
        if (t.isAssignmentExpression(expression)) {
          expression.left = t.memberExpression(t.thisExpression(), expression.left);
          path.replaceWith(expression);
        } else if (t.isCallExpression(expression)) {
          expression.callee = t.memberExpression(t.thisExpression(), expression.callee);
          path.replaceWith(expression);
        } else if (t.isIdentifier(expression)) {
          path.replaceWith(t.memberExpression(t.thisExpression(), expression));
        }
      }
    }
  };
}

export function prepare(babylon, babelGenerator, babelTypes) {
  babylon.tokTypes.hash = { label: "#", beforeExpr: true };

  let {getTokenFromCode} = babylon.Parser.prototype;
  babylon.Parser.prototype.getTokenFromCode = function(code) {
    if (code === 35) {
      ++this.state.pos;
      return this.finishToken(babylon.tokTypes.hash);
    }

    return getTokenFromCode.bind(this)(code);
  };

  let {parseExprAtom} = babylon.Parser.prototype;
  babylon.Parser.prototype.parseExprAtom = function(refShorthandDefaultPos) {
    if (this.state.type === babylon.tokTypes.hash) {
      let node = this.startNode();
      this.next();
      node.expression = this.parseExpression();
      return this.finishNode(node, "ShorthandInstanceExpression");
    }

    return parseExprAtom.bind(this)(refShorthandDefaultPos);
  };

  babelGenerator.CodeGenerator.prototype.ShorthandInstanceExpression = function(node) {
    this.push("#");
    this.print(node.expression, node);
  };

  babelTypes.TYPES.push("ShorthandInstanceExpression");
}
