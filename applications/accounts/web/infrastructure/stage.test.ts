import { branchForStage, hostedUrlForStage, parseStage } from './stage';

describe('Accounts web hosted stages', () => {
  it.each(['develop', 'production', 'pr-1542'] as const)(
    'accepts the %s delivery stage',
    (stage) => {
      expect(parseStage(['--stage', stage])).toBe(stage);
      expect(branchForStage(stage)).toBe(`amplify/${stage}`);
    },
  );

  it('rejects unsupported or missing stages', () => {
    expect(() => parseStage([])).toThrow(/requires --stage/);
    expect(() => parseStage(['--stage', 'staging'])).toThrow(
      /requires --stage/,
    );
  });

  it('keeps Develop on its custom hostname and other stages isolated', () => {
    expect(hostedUrlForStage('develop', 'app-id')).toBe(
      'https://accounts-develop.motechdevelopment.co.uk',
    );
    expect(hostedUrlForStage('production', 'app-id')).toBe(
      'https://amplify-production.app-id.amplifyapp.com',
    );
    expect(hostedUrlForStage('pr-1542', 'app-id')).toBe(
      'https://amplify-pr-1542.app-id.amplifyapp.com',
    );
  });
});
