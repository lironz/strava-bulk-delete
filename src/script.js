'use strict';
(function(){
    const searchHelper = {
        get table(){
            return document.getElementById('search-results');
        },
        get table_thead(){
            return this.table ? this.table.tHead : null;
        },
        get table_thead_tr(){
            return this.table_thead ? this.table_thead.children[0] : null;
        },
        HasActivities(){
            return this.table && this.table.rows && this.table.rows.length > 1;
        }
    }

    function _setHeader(){
        if (searchHelper.table_thead_tr===null || !searchHelper.HasActivities()) {return;}
        const th = document.createElement('th');
        const checkBox = document.createElement('input');
        const deleteBtn = document.createElement('input');
        
        checkBox.setAttribute('type', 'checkbox');
        deleteBtn.setAttribute('type', 'button');
        deleteBtn.setAttribute('value', 'DELETE');
        deleteBtn.setAttribute('style', 'margin-left:10px');
        th.setAttribute('class', 'col-type');
        
        checkBox.onchange = _headerClickEvent;
        deleteBtn.onclick = _deleteEvent;
    
        th.appendChild(checkBox);
        th.appendChild(deleteBtn);
        searchHelper.table_thead_tr.prepend(th);
    }
    function _setRows(){
        for (let c = 1;c < searchHelper.table.rows.length; c++){
            const cell = searchHelper.table.rows[c].insertCell(0);
            const link = searchHelper.table.rows[c].cells[3].getElementsByTagName('a')[0];
            const id = (link.getAttribute('href') || '').replace('https://www.strava.com/activities/', '');
    
            const checkBox = document.createElement('input');
            checkBox.setAttribute('type', 'checkbox');
            checkBox.setAttribute('data-type', 'bulkremove');
            checkBox.setAttribute('data-id', id);
            cell.setAttribute('class', 'view-col col-type');
            
            cell.appendChild(checkBox);
        }
    }
    function _headerClickEvent(e) {
        const checked = e.target.checked;
        const inputs = searchHelper.table.querySelectorAll('input[type="checkbox"][data-type="bulkremove"]');
        inputs.forEach((input)=>{
            input.checked=checked;
        });
    }
    
    function _deleteEvent(e) {
        let table = document.getElementById('search-results');
        const inputs = searchHelper.table.querySelectorAll('input[type="checkbox"][data-type="bulkremove"]:checked');
        const ids = [...inputs].map((input) => {
            return input.dataset.id;
        });
        const removeEach = () => {
            let id = ids.shift();
            if (id){
                _removeActivity(id, removeEach);
            }
        }
        removeEach();
        document.location.reload();
    }
    function _removeActivity(id, done) {
        const token = document.querySelector('meta[name="csrf-token"]');
        const tokenValue = (token ? token.getAttribute('content') : null);
        const xhr = new XMLHttpRequest();

        xhr.open("DELETE", 'https://www.strava.com/athlete/training_activities/'+id);
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.setRequestHeader('X-CSRF-Token', tokenValue);
        xhr.onload = () => {
            done(null, xhr.response);
        };
        xhr.onerror = () => {
            done(xhr.response);
        };
        xhr.send();
    }
    function Init(){
        _setHeader();
        _setRows();
    }
    window.onload = function(){
        setTimeout(()=>Init(),500);
    }
})();