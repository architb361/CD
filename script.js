var grammar = new Array();
/*
    grammar

    grammar.id  <= non terminal 
    grammar.gives <= the productions

    grammar.first <= array( first(id) )
    grammar.follow <= array( follow(id) )

*/

function validate() 
{
    grammar = [];
    var input = document.getElementById("inp").value;
    var state = input.split('\n');
    var j;
    var temp = "";

    for(j=0;j<state.length;j++)
    {
        var line = state[j];
        var exp = String(line).split('→');
        var i;

        var stm = new Object();

        stm.id = exp[0].trim();//production head
        stm.gives = new Array();
        stm.first = new Array();
        stm.follow = new Array();

        var spli = exp[1].split('|');//Production body
        stm.gives.push(spli[0].trim());//First production body element

        for (i = 1; i < spli.length; i++) //remaining elements
        {
                stm.gives.push(spli[i].trim());    
        }

        for(i=0; i<stm.gives.length;i++)//printing productions
            temp = temp + stm.id+"->"+ stm.gives[i]+"<br>";
    
        
        grammar.push(stm);
    }
    left_recursion();
    temp="";
    for(j=0;j<grammar.length;j++)
    for(i=0; i<grammar[j].gives.length;i++)//printing productions
            temp = temp + grammar[j].id+"->"+ grammar[j].gives[i]+"<br>";
    document.getElementById("inputarea").innerHTML = temp;
    document.getElementById("firstbutton").style.visibility="visible";
    
}

function left_recursion()
{
    var i,j;
    //console.log("recursion called\n");
    for(i=0;i<grammar.length;i++)
    {
        for(j=0;j<grammar[i].gives.length;j++)
        {
            if(grammar[i].id == grammar[i].gives[j][0])
            {
                remove_left_recursion(i);
                break;
            }
        }
    }
}

function remove_left_recursion(i)
{
    //console.log(i+" position has recursion");
    var j,k;
    var alpha=new Array();
    var beta=new Array();
    for(j=0;j<grammar[i].gives.length;j++)
    {
        if(grammar[i].id == grammar[i].gives[j][0])
        {
            var temp = grammar[i].gives[j].substring(1);
            alpha.push(temp);
            //console.log("alpha = "+temp);
        }
        else
        {
            beta.push(grammar[i].gives[j]);
            //console.log("beta = "+grammar[i].gives[j]);
        }
    }
    var all = "abcdefghijklmnopqrstuvwxyz".toUpperCase().split('');
    for(j=0;j<all.length;j++)
    {
        var count=0;
        for(k=0;k<grammar.length;k++)
            if(all[j]!=grammar[k].id)
                count=count+1;
        if(count==grammar.length)
            break;
    }
    grammar[i].gives = new Array();
    for(k=0;k<beta.length;k++)
    {
        var temp=beta[k]+all[j];
        grammar[i].gives[k]=temp;
    }
    var stm = new Object();
    stm.id = all[j];
    stm.gives = new Array();
    stm.first = new Array();
    stm.follow = new Array();
    for(k=0;k<alpha.length;k++)
    {
        var temp = alpha+all[j];
        stm.gives.push(temp)
    }
    stm.gives.push("ε");
    grammar.push(stm);
    
}

function calculateFirst()
{

    temp = " "
    find = []


    var all = "abcdefghijklmnopqrstuvwxyz".toUpperCase().split('');

    for( i = 0 ; i < grammar.length ; ++i)
        find.push(grammar[i].id)
    for( i = 0 ; i < grammar.length ; ++i)
    {
        var first = new Array();
        for(j=0; j<grammar[i].gives.length;j++)
        {   var t = String(grammar[i].gives[j]);
            //first.push(t.charAt(0))
            for(k = 0; k <grammar[i].gives[j].length;k++)
            {
                ch = grammar[i].gives[j][k];


                if((ch == ch.toUpperCase()) && isNaN(ch) && all.indexOf(ch)!= -1)
                {   
                    indx = find.indexOf(ch);
                    if( grammar[indx].gives.indexOf('ε')>=0)
                    {
                        first.push(ch);
                    }
                    else
                    {
                        first.push(ch);
                        break;
                    }
                }
                else 
                {
                    first.push(ch);
                    break;
                }
            }
        }
        grammar[i].first = first;
    }
    
     for( i = 0 ; i < grammar.length ; ++i)
                 //console.log(grammar[i].id+" "+grammar[i].first)
      
          
    // A - > B   then first(A) = first(B)  
    done = 1
    while(done)
     {
        for( i = 0 ; i < grammar.length ; ++i)
        {   
            l = new Array();
            for( j =0 ;j< grammar[i].first.length;++j)
            {
                //console.log("runing"+grammar[i].id+" "+grammar[i].first);
                if((grammar[i].first[j] == grammar[i].first[j].toUpperCase()) && isNaN(grammar[i].first[j]) && grammar[i].first[j]!='ε' && all.indexOf(grammar[i].first[j])!=-1)
                    {   x  = grammar[i].first[j];
                        indx = grammar[i].first.indexOf(x);
                       
                        z = grammar[find.indexOf(x)].first.slice();
                        y = z.indexOf('ε');
                        if(y!=-1)
                            z.splice(y,1);
                        l = l.concat(z);
                        
                       // l = l.concat(grammar[find.indexOf(x)].first);
                    }
                else{
                        l.push(grammar[i].first[j]);
                        //console.log(" pushing to "+l + " val "+grammar[i].first[j]);
                    }
            }
            grammar[i].first = l;
        }

        done = 0;
        for( i = 0 ; i < grammar.length ; ++i)
            for( j =0 ;j< grammar[i].first.length;++j)
            {
                    //console.log(grammar[i].id+" "+grammar[i].first)
                    if(grammar[i].first[j] == grammar[i].first[j].toUpperCase() && isNaN(grammar[i].first[j]))
                    {
                        done = 1;
                        break;
                    }
            }


    }

    for(j = 0 ; j < grammar.length ; ++j)
    {   
        a = [];
        for ( i = 0; i < grammar[j].first.length ; i++ ) {
            var current = grammar[j].first[i];
            if (a.indexOf(current) < 0) 
                a.push(current);
        }

        grammar[j].first = a;

    }    

    for(i = 0 ; i < grammar.length ; ++i)
    {   
        temp = temp + grammar[i].id + " - ";
        for(j=0; j<grammar[i].first.length;j++)
            temp = temp + grammar[i].first[j]+ " "; 
        temp = temp +"<br>";        
    }

    document.getElementById("firstarea").innerHTML = temp;
    document.getElementById("followbutton").style.visibility="visible";

}

function calculateFollow()
{
    /*
            1) First put $ (the end of input marker) in Follow(S) (S is the start symbol)
            2) If there is a production A → aBb, (where a can be a whole string) then everything in FIRST(b) except for ε is placed in FOLLOW(B).
            3) If there is a production A → aB, then everything in FOLLOW(A) is in FOLLOW(B)
            4) If there is a production A → aBb, where FIRST(b) contains ε, then everything in FOLLOW(A) is in FOLLOW(B)
    */

    l=[]
    tx = new Array();
    for(i =0 ; i<grammar.length ; i++){ 
        l.push(grammar[i].id);
        grammar[i].follow = tx;
    } 

    for(i = 0 ; i < grammar.length ; ++i)
    {
        lfoll = new Array();

        for(j=0; j < grammar[i].gives.length;j++)
        {
            var t = grammar[i].gives[j];
            
            
            if(t.length>1)
            {
                for(k = 0; k < t.length-1; ++k)
                {
                    charac = t.charAt(k)
                    if(charac == charac.toUpperCase() && isNaN(charac))  
                        {
                            //console.log(" log  -"+charac)
                            indx = l.indexOf(t.charAt(k));
                            indx2 = l.indexOf(t.charAt(k+1));
                            ////console.log(indx +" "+indx2);
                            //rule2
                            if(indx2 !=-1)
                            {
                                grammar[indx].follow = grammar[indx].follow.concat(grammar[indx2].first)
                                // //console.log(t.charAt(k)+" "+grammar[indx].follow);
                            }
                            else
                            {   
                                //console.log(t+" "+grammar[0].follow)
                                grammar[indx].follow.push(t.charAt(k+1))
                                
                                //console.log("pushing "+indx+" "+t.charAt(k)+" "+grammar[indx].follow);
                                //console.log(t+" "+grammar[0].follow)
                            }
                        }
                        
                }

            }
        }  
    }
    
    // rule 1 
   grammar[0].follow.push('$');


   temp="";
   for(i = 0 ; i < grammar.length ; ++i)
    {   
        temp = temp + grammar[i].id + " - ";
        for(j=0; j<grammar[i].follow.length;j++)
            temp = temp + grammar[i].follow[j]+ " "; 
        temp = temp +"<br>";        
    }
  

    document.getElementById("followarea").innerHTML = temp;
    parsingTable();
}


function check()
{
    var i,j;
    for(i=0;i<grammar.length;i++)
    {
        alert(grammar[i].id);
        alert(grammar[i].gives);
    }
}
function getFirst(x){
    for(var i=0;i<grammar.length;i++){
        if(grammar[i].id==x){
            ////console.log('yes');
            //for(var j=0;j<grammar[i].first.length;i++)
                ////console.log(grammar[i].first[j]);
            //console.log("In getFirst: "+grammar[i].first);
            return grammar[i].first;
        }
    }
}

function getFollow(x){
    for(var i=0;i<grammar.length;i++){
        if(grammar[i].id==x){
            //console.log('yes');
            //for(var j=0;j<grammar[i].follow.length;i++)
                ////console.log(grammar[i].follow[j]);
            return grammar[i].follow;
        }
    }

}

function exists(x,y){
    for(var i=0;i<x.length;i++){
        if(x[i]==y)
            return true;
    }
    return false;
}

function getAllTerminals(){
    var terminals=new Array;
    for(var i=0;i<grammar.length;i++)
        terminals=terminals.concat(getTerminals(i));
    return terminals;
}
function getTerminals(n){
    var count=1;
    var ret;
    ret=grammar[n].gives[0];
    for(var j=1;j<grammar[n].gives.length;j++){
            ret=ret.concat(grammar[n].gives[j].split(" "));
            count++;
    }
    var tmp=new Array();
    tmp[0]=ret[0];
    count=0;
    for(var i=0;i<ret.length;i++){
        if(exists(tmp,ret[i])==false)
            tmp.push(ret[i]);
    }
    count=0;
    var tmp2=new Array;
    for(var i=0;i<tmp.length;i++){
        if(!(isNaN(parseInt(tmp[i])))){
            tmp2.push(tmp[i]);
            continue;
        }
        var ch=tmp[i].toLowerCase();
        if(tmp[i]==ch && ch!="ε"){
                ////console.log("yes");
                tmp2.push(tmp[i]);
        }
    }
    //console.log(tmp2);
    return tmp2;
}
var productions;
var table;
function displayTable(){
    //console.log(table);
    var t=document.getElementById("table");
    var r=t.insertRow(0);
    for(var i=0;i<table.terms.length+1;i++){
        var c1=r.insertCell(i);
        if(i==0){
            c1.innerHTML="Table";
            continue;
        }
        c1.innerHTML=table.terms[i-1];
    }
    for(var i=1;i<table.heads.length+1;i++){
        var r=t.insertRow(i);
        for(var j=0;j<table.terms.length+1;j++){
            var c1=r.insertCell(j);
            if(j==0)
                c1.innerHTML=table.heads[i-1];
            else if(table.values[i-1][j-1]==undefined)
                continue;
            else
                c1.innerHTML=table.values[i-1][j-1];
        }
    }
}
function parsingTable(){
    var rows=grammar.length;
    table=new Object();
    table.values=new Array(rows);
    var terminals =new Array;
    terminals=getAllTerminals();
    terminals.push("$");
    var cols=terminals.length;
    table.heads=new Array(rows);
    table.terms=new Array(cols);
    productions=new Array(rows);
    for(var i=0;i<rows;i++){
        table.values[i]=new Array(cols);
        table.heads[i]=grammar[i].id;
        productions[i]=grammar[i].gives;
    }
    
    for(var i=0;i<cols;i++)
        table.terms[i]=terminals[i];
    //console.log(table.heads);
    //console.log(table.terms);
    //console.log(productions);
    for(var i=0;i<rows;i++){
        var first=getFirst(table.heads[i]);
        //console.log("First:\n"+first);
        for(var j=0;j<first.length;j++){
            for(var k=0;k<cols;k++){
                if(first[j]==table.terms[k]){
                    //console.log(first[j]+"=="+table.terms[k]);
                    table.values[i][k]=table.heads[i]+"->"+productions[i];
                    //console.log(table.values[i][k]);
                }
            }
            if(first[j]=="ε"){
                var follow=getFollow(table.heads[i]);
                for(var x=0;x<follow.length;x++){
                    for(var y=0;y<cols;y++){
                        if(follow[x]==table.terms[y]){
                            table.values[i][y]=table.heads[i]+"->"+productions[i];
                        }
                    }
                }
            }
        }
    }
    displayTable();
}

    
    