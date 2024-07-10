export function angleTo(x1, y1, x2, y2)
{
	return Math.atan2(y2 - y1, x2 - x1);
}
export function distanceTo(x1, y1, x2, y2)
{
	return Math.hypot(x2 - x1, y2 - y1);
}
export function IsOutsideLayout(inst)
{
	const layout = inst.layout;
	return inst.x < 0 || inst.y < 0 ||
			inst.x > layout.width || inst.y > layout.height;
}
export function toRadians(x)
{
	return x * (Math.PI / 180);
}
export function angleRotate(start, end, step)
{
	const ss = Math.sin(start);
	const cs = Math.cos(start);
	const se = Math.sin(end);
	const ce = Math.cos(end);

	if (Math.acos(ss * se + cs * ce) > step)
	{
		if (cs * se - ss * ce > 0)
			return start + step;
		else
			return start - step;
	}
	else
	{
		return end;
	}
}
