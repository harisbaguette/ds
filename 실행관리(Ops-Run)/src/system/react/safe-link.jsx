export function safeLink(value) {return /^(?:https?:|mailto:|tel:|#|\/(?!\/)|\.\.?\/)/i.test(String(value))?value:'#';}
