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
        get table_body(){
            return this.table.tBodies.length > 0 ? this.table.tBodies[0] : null;
        },
        get activities_rows(){
            return this.table && this.table.rows && this.table.rows.length > 1 ?
                    Array.from(this.table.rows).filter((row) => row.classList.contains('training-activity-row')) :
                    null;
        },
        HasActivities(){
            return this.activities_rows && this.activities_rows.length > 0;
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
        if (!searchHelper.HasActivities()) {return;}
        searchHelper.activities_rows.forEach((row)=>{
            const cell = row.insertCell(0);
            const link = row.cells[3].getElementsByTagName('a')[0];
            const id = (link.getAttribute('href') || '').replace('https://www.strava.com/activities/', '');
    
            const checkBox = document.createElement('input');
            checkBox.setAttribute('type', 'checkbox');
            checkBox.setAttribute('data-type', 'bulkremove');
            checkBox.setAttribute('data-id', id);
            cell.setAttribute('class', 'view-col col-type');
            
            cell.appendChild(checkBox);
        });
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
        const removeEach = (done) => {
            let id = ids.shift();
            if (id){
                _removeActivity(id, ()=> removeEach(done));
            }else{
                done();
            }
        }
        removeEach(()=>{
            document.location.reload();
        });
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
    function _observe(){
        if (MutationObserver){
            var observer = new MutationObserver(function(mutationsList){
                _setRows();
            });
            observer.observe(searchHelper.table_body, {attributes: true,  childList: true });
        }
    } 
    function Init(){
        _setHeader();
        _setRows();
        _observe();
    }
    window.onload = function(){
        setTimeout(()=>Init(),500);
    }
})();