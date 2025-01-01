/**
 * Interface ICreateElementProperties
 * Created 13.12.21
 *
 * @author Christoph Ehlers <webmaster@c-ehlers.de>
 */
import { IMagicProperties } from "./IMagicProperties";

export interface ICreateElementProperties extends IMagicProperties {
  alt?: string;
  data?: { [name: string]: any };
  class?: string;
  height?: number|string;
  href?: string;
  id?: string;
  placeholder?: string;
  src?: string;
  rel?: string;
  width?: number|string;
  [name: string]: any;
}
