# !Work in progress!
# CEUTILS

## ComponentStarter

### Register service 
`service.js`
```javascript
import AbstractService from "./src/service/AbstractService";
export default class MyService extends AbstractService {
...
    getName() {
        return "MyService";
    }
...
}
```
`app.js`
```typescript
import ComponentStarter from "./src/service/ComponentStarter";
import MyService from "./service"

const componentStarter = new ComponentStarter();
componentStarter.registerComponent(MyService);
```

### Start React-Component
```typescript
import ComponentStarter from "./src/service/ComponentStarter";
const test = new ComponentStarter();
test.registerComponent()
```

```html
...
    <script >
    
    </script>
...
```

## Eventhandler

	- addListener
	- dispatch
	- setErrorHandler
	- on

## Interfaces

- IDataEntry
    - key:string
    - value:any


	
