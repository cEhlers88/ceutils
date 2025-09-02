/**
 * Library IVelocity3D
 * Created 27.12.24
 *
 * @author Christoph Ehlers <webmaster@c-ehlers.de>
 */
import { EPositionType } from "../enum/EPositionType";
import { EPositionUnit } from "../enum/EPositionUnit";
import IPosition from "./IPosition";
export default interface IVector3D extends IPosition {
  z: number;
  positionType?: EPositionType;
  positionUnit?: EPositionUnit;
}
