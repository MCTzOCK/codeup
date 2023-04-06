/**
 * @author Ben Siebert <ben@mctzock.de>
 * @copyright (c) 2018-2021 Ben Siebert. All rights reserved.
 */

export interface AbstractSyntaxTree {
  command: string;
  intents: number;
  children: AbstractSyntaxTree[];
  args: string[];
}
