/**
 * Interface ICreateElementProperties
 * Created 13.12.21
 *
 * @author Christoph Ehlers <Christoph.Ehlers1988@gmx.de>
 */
import { IMagicProperties } from "./IMagicProperties";

export interface ICreateElementProperties extends IMagicProperties {
  alt?: string;
  data?: { [name: string]: any };
  class?: string;
  height?: string;
  href?: string;
  id?: string;
  placeholder?: string;
  src?: string;
  rel?: string;
  width?: string;
  [name: string]: any;
}
