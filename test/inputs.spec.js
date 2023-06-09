const when = require('jest-when').when;
const core = require('@actions/core');
const inputs = require('../src/inputs');

describe('Inputs', () => {

  const INITIAL_RUNNER_TEMP = process.env.RUNNER_TEMP;

  afterEach(() => {
    jest.clearAllMocks();
    process.env.RUNNER_TEMP = INITIAL_RUNNER_TEMP;
  });

  afterAll(() => {
    process.env.RUNNER_TEMP = INITIAL_RUNNER_TEMP;
  });

  it("should fail on missing required 'repository' input", () => {

    // Given
    // When, Then
    expect(() => inputs.load()).toThrow(`Input required and not supplied: repository`);
  });

  it("should fail on missing required 'token' input", () => {

    // Given
    const getInputSpy = jest.spyOn(core, "getInput");
    when(getInputSpy)
      .expectCalledWith('repository', {required: true})
      .mockReturnValueOnce('Steph0/dotenv-configserver');

    // When, Then
    expect(() => inputs.load()).toThrow(`Input required and not supplied: token`);
  });

  it("should return default values for optional inputs", () => {

    // Given
    const getInputSpy = jest.spyOn(core, "getInput");
    when(getInputSpy)
      .expectCalledWith('repository', {required: true})
      .mockReturnValueOnce('Steph0/dotenv-configserver');
    
    when(getInputSpy)
      .expectCalledWith('token', {required: true})
      .mockReturnValueOnce('xxxxxxxxxxxxxxxxxx');

    // Force undefined value to use last fallback
    delete process.env['RUNNER_TEMP'];

    // When
    const results = inputs.load();

    // Then
    expect(results).toEqual({
      repository: 'Steph0/dotenv-configserver',
      owner: 'Steph0',
      repo: 'dotenv-configserver',
      token: 'xxxxxxxxxxxxxxxxxx',
      branch: 'main',
      destination: '.',
      directory: '.',
      filename: '.env',
      profile: '',
      cleanup: true,
    });
  });

  it("should return the runner's default working folder when available", () => {

    // Given
    const getInputSpy = jest.spyOn(core, "getInput");
    when(getInputSpy)
      .expectCalledWith('repository', {required: true})
      .mockReturnValueOnce('Steph0/dotenv-configserver');
    
    when(getInputSpy)
      .expectCalledWith('token', {required: true})
      .mockReturnValueOnce('xxxxxxxxxxxxxxxxxx');

    process.env.RUNNER_TEMP = 'tmpFolder'

    // When
    const results = inputs.load();

    // Then
    expect(results).toBeDefined();
    expect(results.destination).toEqual('tmpFolder');
  });
});