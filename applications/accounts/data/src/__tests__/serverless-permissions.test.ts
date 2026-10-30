import { readFileSync } from 'node:fs';

describe('DataLambdaFunctionRole DynamoDB transaction permissions', () => {
  it('grants the underlying DynamoDB actions used by balance transactions', () => {
    const serverlessConfig = readFileSync('serverless.yml', 'utf8');
    const roleStart = serverlessConfig.indexOf(
      '\n    DataLambdaFunctionRole:\n',
    );
    const roleEnd = serverlessConfig.indexOf('\n  Outputs:', roleStart);
    const dataRole = serverlessConfig.slice(roleStart, roleEnd);

    expect(dataRole).toContain('dynamodb:ConditionCheckItem');
    expect(dataRole).toContain('dynamodb:GetItem');
    expect(dataRole).toContain('dynamodb:PutItem');
    expect(dataRole).toContain('dynamodb:UpdateItem');
    expect(dataRole).not.toContain('dynamodb:TransactWriteItems');
  });
});
