/**
 * @author Ben Siebert <ben@mctzock.de>
 * @copyright (c) 2018-2021 Ben Siebert. All rights reserved.
 */

export class Error {
  public static readonly ERROR_MISSING_PARAMETER =
    "// FEHLER: Diese Zeile enthielt zu wenige Parameter.";
  public static readonly ERROR_UNKNOWN_TYPE =
    "// FEHLER: Diese Zeile enthielt einen unbekannten Typ.";
  public static readonly ERROR_UNKNOWN_OPERATOR =
    "// FEHLER: Diese Zeile enthielt einen unbekannten Operator.";
  public static readonly ERROR_NOT_A_NUMBER =
    "// FEHLER: Diese Zeile enthielt keine Zahl.";
}
