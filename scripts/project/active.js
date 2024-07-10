import Globals from "./globals.js";
import * as Utils from "./formulaMoveFunc.js";
export function Tick(runtime)
{
	const dt = runtime.dt;
	MoveCanon(runtime);
	for (const fruitInstance of runtime.objects.Fruit.instances())
	{
		fruitInstance.Move();
	}
	for (const bomInstance of runtime.objects.Bom.instances())
	{
		MoveBom(bomInstance, dt);
		CheckBomHitFruit(bomInstance, runtime);
		if (Utils.IsOutsideLayout(bomInstance))
			bomInstance.destroy();
	}
	for (const sparkInstance of runtime.objects.EfekTembak.instances())
	{
		FadeEfekTembak(sparkInstance, dt);
	}
	const canonTextInstance = runtime.objects.Skor.getFirstInstance();
	canonTextInstance.text = "" + Globals.score;
}
function MoveCanon(runtime)
{
	const canonInst = Globals.canonInstance;
	const dt = runtime.dt;
	if (!canonInst)
		return;
	runtime.layout.scrollTo(canonInst.x, canonInst.y);
	const mouse = runtime.mouse;
	canonInst.angle = Utils.angleTo(canonInst.x, canonInst.y,
									 mouse.getMouseX(), mouse.getMouseY());
}
function MoveBom(inst, dt)
{
	const speed = 600;
	inst.x += Math.cos(inst.angle) * speed * dt;
	inst.y += Math.sin(inst.angle) * speed * dt;
}
function CheckBomHitFruit(bomInstance, runtime)
{
	const EfekTembak = runtime.objects.EfekTembak;
	for (const fruitInstance of runtime.objects.Fruit.instances())
	{
		if (bomInstance.testOverlap(fruitInstance))
		{
			const efekTembakInstance = EfekTembak.createInstance("Main",
											bomInstance.x, bomInstance.y);
			efekTembakInstance.angleDegrees = runtime.random() * 360;
			bomInstance.destroy();
			Globals.fruitSpeed++;
			fruitInstance.health--;
			if (fruitInstance.health <= 0)
				fruitInstance.DestroyWithEfekTembak();
		}
	}
}
function FadeEfekTembak(inst, dt)
{
	inst.opacity -= 2 * dt;
	if (inst.opacity <= 0)
		inst.destroy();
}
export function OnMouseDown(e, runtime)
{
	if (e.button !== 0)
		return;
	const canonInst = Globals.canonInstance;
	if (!canonInst)
		return;
	const bomInstance = runtime.objects.Bom.createInstance("Main",
			canonInst.getImagePointX(0), canonInst.getImagePointY(0));
	bomInstance.angle = canonInst.angle;
}
export function OnKeyDown(e, runtime)
{
	if (!Globals.canonInstance && e.key === " ")
	{
		Globals.score = 0;
		Globals.fruitSpeed = 100;
		runtime.goToLayout(0);
	}
}
export default class FruitInstance extends globalThis.InstanceType.Fruit
{
	constructor()
	{
		super();
		this.health = 2;
		this.speed = Globals.fruitSpeed;
	}
	static Create(runtime) {
		runtime.objects.Fruit.createInstance("Main",
								runtime.random() * runtime.layout.width,
								0);
	}
	Move()
	{
		const dt = this.runtime.dt;
		const canonInst = Globals.canonInstance;
		this.x += Math.cos(this.angle) * this.speed * dt;
		this.y += Math.sin(this.angle) * this.speed * dt;
		if (canonInst)
		{
			if (Utils.IsOutsideLayout(this))
			{
				this.angle = Utils.angleTo(this.x, this.y,
									 canonInst.x, canonInst.y);
			}
			if (Utils.distanceTo(this.x, this.y,
								 canonInst.x, canonInst.y) < 2000)
			{
				const angleToCanon = Utils.angleTo(this.x, this.y,
									 				canonInst.x, canonInst.y);
				this.angle = Utils.angleRotate(this.angle, angleToCanon,
											   Utils.toRadians(1));
			}
			if (this.testOverlap(canonInst))
			{
				canonInst.destroy();
				Globals.canonInstance = null;
				Globals.gameOverTextInstance.isVisible = true;
			}
		}
	}
	DestroyWithEfekTembak()
	{
		const EfekTembak = this.runtime.objects.EfekTembak;
		const efekTembakInstance = EfekTembak.createInstance("Main", this.x, this.y);
		efekTembakInstance.angleDegrees = this.runtime.random() * 360;
		Globals.score += 1;
		this.destroy();
	}
}