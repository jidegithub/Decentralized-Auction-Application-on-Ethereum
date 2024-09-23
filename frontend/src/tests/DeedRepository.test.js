import { createApp } from 'vue';
import App from './App.vue';
import DeedRepository from './models/DeedRepository';

describe('Main.js', () => {
  let deedRepositoryInstance;

  beforeAll(() => {
    // Simulate the app creation and setup
    const app = createApp(App);
    app.mixin({
      setup() {
        deedRepositoryInstance = new DeedRepository();
        return { deedRepositoryInstance };
      },
    });
    app.mount(document.createElement('div')); // Mount to a temporary element
  });

  it('should create deedRepositoryInstance', () => {
    expect(deedRepositoryInstance).toBeDefined();
    // Optionally check properties of deedRepositoryInstance
  });
});
