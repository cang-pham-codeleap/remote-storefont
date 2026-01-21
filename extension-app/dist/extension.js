"use strict";
(() => {
  // src/index.ts
  var clickCount = 0;
  self.onRender((root) => {
    const card = root.createComponent("Card");
    const textNode = root.createText("Hello from Extension! \u{1F44B}");
    card.appendChild(textNode);
    const button = root.createComponent("Button", {
      onPress: () => {
        clickCount++;
        textNode.updateText(`Clicked ${clickCount} time${clickCount !== 1 ? "s" : ""}! \u{1F389}`);
        console.log("[Extension] Button clicked! Count:", clickCount);
        try {
          console.log("Window:", typeof window);
        } catch {
          console.log("[Extension] \u2713 Cannot access window (as expected)");
        }
      }
    });
    button.appendChild(root.createText("Click me! \u{1F680}"));
    card.appendChild(button);
    const securityButton = root.createComponent("Button", {
      onPress: () => {
        const results = [];
        try {
          results.push(`document: ${typeof document}`);
        } catch {
          results.push("document: blocked \u2713");
        }
        try {
          results.push(`window: ${typeof window}`);
        } catch {
          results.push("window: blocked \u2713");
        }
        try {
          results.push(`localStorage: ${typeof localStorage}`);
        } catch {
          results.push("localStorage: blocked \u2713");
        }
        console.log("[Extension] Security check:", results.join(", "));
        textNode.updateText("Security check complete! See console.");
      }
    });
    securityButton.appendChild(root.createText("Test Security \u{1F512}"));
    card.appendChild(securityButton);
    root.appendChild(card);
    root.mount();
    console.log("[Extension] UI mounted successfully!");
  });
})();
//# sourceMappingURL=extension.js.map
