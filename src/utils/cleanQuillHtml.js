const cleanQuillHtml = (html) => {
  if (!html) return '';
  
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  
  tempDiv.querySelectorAll('[class*="ql-"]').forEach(el => el.remove());
  
  tempDiv.querySelectorAll('[contenteditable]').forEach(el => {
    el.removeAttribute('contenteditable');
  });
  
  tempDiv.querySelectorAll('ol').forEach(ol => {
    const firstLi = ol.querySelector('li[data-list="bullet"]');
    if (firstLi) {
      const ul = document.createElement('ul');
      ul.innerHTML = ol.innerHTML;
      ul.querySelectorAll('li').forEach(li => li.removeAttribute('data-list'));
      ol.parentNode.replaceChild(ul, ol);
    } else {
      ol.querySelectorAll('li').forEach(li => li.removeAttribute('data-list'));
    }
  });
  
  return tempDiv.innerHTML.trim();
};

export default cleanQuillHtml