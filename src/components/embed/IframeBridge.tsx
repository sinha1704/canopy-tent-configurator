import { useEffect } from 'react';
import { useConfiguratorStore } from '../../store/useConfiguratorStore';
import { useCartStore } from '../../store/useCartStore';

/**
 * Enterprise Iframe PostMessage Bridge
 * Allows seamless 2-way embedding into Shopify liquid themes, Webflow, or headless Hydrogen:
 * 
 * Events Dispatched to Parent Window:
 * - `CONFIGURATOR_READY`
 * - `CONFIGURATOR_CHANGE`: { size, frame, surfacesCount, total }
 * - `ADD_TO_CART_SUCCESS`: { payload }
 * 
 * Events Accepted from Parent Window:
 * - `SET_TENT_SIZE`: { size }
 * - `SET_FRAME_TYPE`: { frameType }
 * - `TRIGGER_CART_ADD`
 */
export function IframeBridgeModal() {
  useEffect(() => {
    // 1. Notify Parent Window when Configurator is loaded
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type: 'CONFIGURATOR_READY', timestamp: Date.now() }, '*');
    }

    // 2. Listen for postMessage commands from parent window
    const handleIncomingMessage = (event: MessageEvent) => {
      try {
        const { data } = event;
        if (!data || typeof data !== 'object') return;

        if (data.type === 'SET_TENT_SIZE' && data.size) {
          useConfiguratorStore.getState().setTentSize(data.size);
        } else if (data.type === 'SET_FRAME_TYPE' && data.frameType) {
          useConfiguratorStore.getState().setFrameType(data.frameType);
        } else if (data.type === 'TRIGGER_CART_ADD') {
          useCartStore.getState().addToCart();
        }
      } catch (err) {
        console.warn('Iframe postMessage parse error', err);
      }
    };

    window.addEventListener('message', handleIncomingMessage);

    // 3. Subscribe to Cart updates and emit CART_UPDATED to parent window
    const unsubCart = useCartStore.subscribe((state, prevState) => {
      if (state.cartItems !== prevState.cartItems && state.cartItems.length > 0) {
        const latestItem = state.cartItems[0];
        if (window.parent && window.parent !== window) {
          window.parent.postMessage(
            {
              type: 'CART_UPDATED',
              event: 'ADD_TO_CART_SUCCESS',
              payload: latestItem,
              cartCount: state.cartItems.length,
              timestamp: Date.now()
            },
            '*'
          );
        }
      }
    });

    return () => {
      window.removeEventListener('message', handleIncomingMessage);
      unsubCart();
    };
  }, []);

  // Invisible background listener, no intrusive floating button
  return null;
}

