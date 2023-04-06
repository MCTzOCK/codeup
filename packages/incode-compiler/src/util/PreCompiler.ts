/**
 * @author Ben Siebert <ben@mctzock.de>
 * @copyright (c) 2018-2021 Ben Siebert. All rights reserved.
 */

export class PreCompiler {
  public static preCompile(source: string): string {
    source = source.replace(/ {2}/g, "");
    source = source.replace(/\r/g, "");
    return source;
  }
}
