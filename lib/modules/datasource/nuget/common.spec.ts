import { getHttpOpts, sortNugetVersions } from './common';
import { hostRules } from '~test/util';

describe('modules/datasource/nuget/common', () => {
  it.each`
    version         | other           | result
    ${'invalid1'}   | ${'invalid2'}   | ${0}
    ${'invalid'}    | ${'1.0.0'}      | ${-1}
    ${'1.0.0'}      | ${'invalid'}    | ${1}
    ${'1.0.0-rc.1'} | ${'1.0.0'}      | ${-1}
    ${'1.0.0'}      | ${'1.0.0-rc.1'} | ${1}
    ${'1.0.0'}      | ${'1.0.0'}      | ${0}
  `(
    'sortNugetVersions("$version", "$other") === $result',
    ({
      version,
      other,
      result,
    }: {
      version: string;
      other: string;
      result: number;
    }) => {
      const res = sortNugetVersions(version, other);
      expect(res).toBe(result);
    },
  );

  it('creates HttpOptions with token as API key', () => {
    hostRules.add({ hostType: 'nuget', token: 'testtoken' });
    const url = 'https://example.test';
    const res = getHttpOpts(url);
    expect(res).toEqual({ headers: { 'X-NUGET-APIKEY': 'testtoken' } });
  });

  it('creates empty HttpOptions for empty token', () => {
    hostRules.clear();
    const url = 'https://example.test';
    const res = getHttpOpts(url);
    expect(res).toEqual({});
  });
});
