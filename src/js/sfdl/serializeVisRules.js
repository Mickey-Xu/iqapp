import { appendChild, ruleArgumentToString } from "./utils/xml";
import { removeXMLInvalidChars } from "../expr/isValidIdentifier";

function buildSfdl(doc, fields, fieldsForm) {
  const form = doc.createElement("visibility_rules");
  const findField = (id) => fields.find((f) => f.id === id);
  doc.appendChild(form);

  fields.map((component) => {
    const section = appendChild(doc, form, "question_visibility_rules", null, {
      identifier: component.settings.identifier,
    });

    let newRuleList = [...component.settings.visRules];
    const orderRules = newRuleList.sort(
      (intRules, extRules) => intRules.positionRule - extRules.positionRule
    );

    orderRules.map((rule) => {
      getIdentifier(doc, section, rule.fieldId, rule, fieldsForm);
    });
  });
}

function getIdentifier(doc, section, id, rule, fieldsForm) {
  fieldsForm
    .filter((component) => component.id === id)
    .map((id) => {
      appendChild(doc, section, "condition", null, {
        "field-identifier": id.settings.identifier,
        operator: rule.operatorId,
        "conjunction-operator": rule.conjunctionOperator,
        argument: ruleArgumentToString(id, rule.operatorId, rule.argument),
        type: id.type,
      });
    });
}

export default function serializeVisRules(fields, fieldsForm) {
  const doc = document.implementation.createDocument("", "", null);
  buildSfdl(doc, fields, fieldsForm);

  const serializer = new XMLSerializer();
  return removeXMLInvalidChars(
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
      serializer.serializeToString(doc)
  );
}
