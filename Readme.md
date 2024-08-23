# CEUTILS - 23.08.2024

## CachedDataProvider
"CachedDataProvider" reduces the number of API calls by caching the data and retrieving it from the cache when needed. 
Each instance of a CachedDataProvider object has its own cache that can be manually cleared.

### Usage 
```javascript
// Create a new instance of CachedDataProvider
import CachedDataProvider from "@cehlers88/ceutils/build/Provider/CachedDataProvider";
const dataProvider = new CachedDataProvider();

// Using the dataProvider to fetch data
dataProvider.fetch({
  url: "https://xyz.net",
  evalJson: true, // Optional
  method: "GET", // Optional
  data: { // Optional
  }
}).then(v=>{
    // handle response data
});

// Clear the cache
dataProvider.clearCache();
```

## ComponentStarter

### Register service 
`service.js`
```javascript
import ComponentBaseService from "./ComponentBaseService";
export default class MyService extends ComponentBaseService {
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


	
