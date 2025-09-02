# DrawEngine 

# DrawEngineAnalyzed
DrawEngineAnalyzed ist eine Erweiterung der DrawEngine, die den selben Funktionsumfang wie eine normale DrawEngine bietet, jedoch darüber hinaus 
weitere Analyseinformationen bereitstellt. Diese Informationen können bei der Fehlerbehebung und Optimierung hilfreich sein.
DrawEngineAnalyzed sollten jedoch nicht in einem Produktivsystem verwendet werden, da sie die Performance durch einen zusätzlichen Rechenaufwand beeinträchtigen.

## Verwendung von DrawEngineAnalyzed
Die Verwendung von DrawEngineAnalyzed ist identisch mit der Verwendung der normalen DrawEngine. 
Der einzige Unterschied besteht darin, dass die Klasse DrawEngineAnalyzed anstelle von DrawEngine verwendet wird. Ausserdem ist es notwendig, einen Startpunkt zu definieren,

```javascript

Import {canvasLib} from "@cehlers88/ceutils";

const drawEngineAnalyzed = canvasLib.getDrawEngineAnalyzed(canvas); // Erstellt eine neue Instanz von DrawEngineAnalyzed

const _loop = () => {
    drawEngineAnalyzed
        .start()        // Startet den Analyzer
        .cls()          // Clear Screen
        .rectangle({    // example usage of rectangle
            x: 10,
            y: 10,
            width: 100,
            height: 100,
        }, "black", "yellow")
        ...
    ;   
    window.requestAnimationFrame(_loop);
}

_loop();
```


- Wozu benötigt der Analyzer einen start() aufruf? - Kann dieser nicht automatisch ermittelt werden?
    - Der Startpunkt kann nicht automatisch ermittelt werden, da der Analyzer in der Regel in einer Endlosschleife läuft und daher ohne Startpunkt nicht weiß, wann ein neuer Durchlauf beginnt.