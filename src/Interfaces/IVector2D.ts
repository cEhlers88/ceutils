/**
 * Library IVelocity2D
 * Created 01.10.24
 *
 * @author Christoph Ehlers <webmaster@c-ehlers.de>
 */
import { EPositionType } from "../enum/EPositionType";
import { EPositionUnit } from "../enum/EPositionUnit";
import IPosition from "./IPosition";
export default interface IVector2D extends IPosition {
  rotation?: number;
  positionType?: EPositionType;
  positionUnit?: EPositionUnit;
}
