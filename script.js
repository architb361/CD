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

        stm.id = exp[0].trim();
        stm.gives = new Array();
        stm.first = new Array();
        stm.follow = new Array();

        var spli = exp[1].split('|');
        stm.gives.push(spli[0].trim());

        for (i = 1; i < spli.length; i++) 
        {
                stm.gives.push(spli[i].trim());    
        }

        for(i=0; i<stm.gives.length;i++)
            temp = temp + stm.id+"->"+ stm.gives[i]+"<br>";
    
        
        grammar.push(stm);
    }
    
    document.getElementById("inputarea").innerHTML = temp;
    document.getElementById("firstbutton").style.visibility="visible";
}

function calculateFirst()
{

    temp = " "
    find = []
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
                ch = grammar[i].gives[j][k]         
                if((ch == ch.toUpperCase()) && isNaN(ch))
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
                 console.log(grammar[i].id+" "+grammar[i].first)
      
          
    // A - > B   then first(A) = first(B)  
    done = 1
    while(done)
     {
        for( i = 0 ; i < grammar.length ; ++i)
        {   
            l = new Array();
            for( j =0 ;j< grammar[i].first.length;++j)
            {
                console.log("runing"+grammar[i].id+" "+grammar[i].first);
                if((grammar[i].first[j] == grammar[i].first[j].toUpperCase()) && isNaN(grammar[i].first[j]) && grammar[i].first[j]!='ε' )
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
                        console.log(" pushing to "+l + " val "+grammar[i].first[j]);
                    }
            }
            grammar[i].first = l;
        }

        done = 0;
        for( i = 0 ; i < grammar.length ; ++i)
            for( j =0 ;j< grammar[i].first.length;++j)
            {
                    console.log(grammar[i].id+" "+grammar[i].first)
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
                    if(charac == charac.toUpperCase())  
                        {
                            indx = l.indexOf(t.charAt(k));
                            indx2 = l.indexOf(t.charAt(k+1));
                            //console.log(indx +" "+indx2);
                            //rule2
                            if(indx2 !=-1)
                            {
                                grammar[indx].follow = grammar[indx].follow.concat(grammar[indx2].first)
                                // console.log(t.charAt(k)+" "+grammar[indx].follow);
                            }
                            else
                            {   
                                console.log(t+" "+grammar[0].follow)
                                grammar[indx].follow.push(t.charAt(k+1))
                                
                                console.log("pushing "+indx+" "+t.charAt(k)+" "+grammar[indx].follow);
                                console.log(t+" "+grammar[0].follow)
                            }
                        }
                        
                }

            }
        }  
    }

    // rule 1 
//    grammar[0].follow.push('$');
  

}



function check()
{
    var i,j;
    for(i=0;i<grammer.length;i++)
    {
        alert(grammer[i].id);
        alert(grammer[i].gives);
    }
}

function removeleftrecursion()
{
}
