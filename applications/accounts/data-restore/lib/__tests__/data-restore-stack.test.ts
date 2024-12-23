import { App } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { DataRestoreStack } from '../data-restore-stack';

describe('DomainStack', () => {
  let app: App;

  beforeEach(() => {
    app = new App();
  });

  it('should synthesize as expected', () => {
    const stack = new DataRestoreStack(
      app,
      'TestStack',
      {},
      {
        source: 'source-table',
        target: 'target-table',
      },
    );

    const template = Template.fromStack(stack);

    expect(template).toMatchSnapshot();
  });
});
