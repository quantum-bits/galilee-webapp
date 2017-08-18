import { ByteConversionPipe } from './byte-conversion.pipe';

describe('ByteConversionPipe', () => {
  it('create an instance', () => {
    const pipe = new ByteConversionPipe();
    expect(pipe).toBeTruthy();
  });
});
