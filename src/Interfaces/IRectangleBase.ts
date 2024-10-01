/**
 * Library IRectangleBase
 * Created 01.10.24
 *
 * @author Christoph Ehlers <webmaster@c-ehlers.de>
 */
import IPosition from "./IPosition";

export default interface IRectangleBase extends IPosition{
    height: number;
    width: number;
}
