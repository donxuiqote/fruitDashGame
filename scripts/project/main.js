import Globals from "./globals.js";
import * as GameMethods from "./active.js";
import FruitInstance from "./active.js";
runOnStartup(async runtime =>
{
	runtime.objects.Fruit.setInstanceClass(FruitInstance);
	runtime.addEventListener("beforeprojectstart",
							 () => OnBeforeProjectStart(runtime));
});
function OnBeforeProjectStart(runtime)
{
	runtime.layout.addEventListener("beforelayoutstart",
								   () => OnBeforeLayoutStart(runtime));
	runtime.addEventListener("tick", () => GameMethods.Tick(runtime));
	runtime.addEventListener("mousedown", e => GameMethods.OnMouseDown(e, runtime));
	runtime.addEventListener("keydown", e => GameMethods.OnKeyDown(e, runtime));
	setInterval(() => FruitInstance.Create(runtime), 700);
}
function OnBeforeLayoutStart(runtime)
{
	Globals.canonInstance = runtime.objects.Canon.getFirstInstance();
	Globals.gameOverTextInstance = runtime.objects.GameOverText.getFirstInstance();
	Globals.gameOverTextInstance.isVisible = false;
	for (const fruitInstance of runtime.objects.Fruit.instances())
	{
		fruitInstance.angleDegrees = runtime.random() * 360;
	}
}
