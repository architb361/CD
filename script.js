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
    
    document.getElementById("inputarea").innerHTML = temp;
    document.getElementById("firstbutton").style.visibility="visible";
}

function calculateFirst()
{

    temp = " "
    find = []
    for( i = 0 ; i < grammar.length ; ++i)
    {
        find.push(grammar[i].id)
        var first = new Array();
        for(j=0; j<grammar[i].gives.length;j++)
        {   var t = String(grammar[i].gives[j]);
            first.push(t.charAt(0))
        }
        grammar[i].first = first;
    }
    

        
    done = 1
    while(done)
    {
        for( i = 0 ; i < grammar.length ; ++i)
        {   
            l = []
            for( j =0 ;j< grammar[i].first.length;++j)
            {
                if(grammar[i].first[j] == grammar[i].first[j].toUpperCase() && isNaN(grammar[i].first[j]))
                    {   x  = grammar[i].first[j];
                        indx = grammar[i].first.indexOf(x);
                        grammar[i].first.splice(indx,1);
                        l = l.concat(grammar[find.indexOf(x)].first);
                    }
            }
            grammar[i].first = l;
        }

        done = 0;
        for( i = 0 ; i < grammar.length ; ++i)
            for( j =0 ;j< grammar[i].first.length;++j)
                if(grammar[i].first[j] == grammar[i].first[j].toUpperCase() && isNaN(grammar[i].first[j]))
                {
                    console.log(grammar[i].id+" "+grammar[i].first[j])
                    done = 1;
                    break;
                }



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

function getFirst(x){
	for(var i=0;i<grammar.length;i++){
		if(grammar[i].id==x){
			console.log('yes');
			for(var j=0;j<grammar[i].first.length;i++)
				console.log(grammar[i].first[j]);
		}
	}
}
function getFollow(x){
	for(var i=0;i<grammar.length;i++){
		if(grammar[i].id==x){
			console.log('yes');
			for(var j=0;j<grammar[i].follow.length;i++)
				console.log(grammar[i].follow[j]);
		}
	}
}
var ret;
function exists(x,y){
	for(var i=0;i<x.length;i++){
		if(x[i]==y)
			return true;
	}
	return false;
}
function getAllTerminals(){
	var x=new Array;
	for(var i=0;i<grammar.length;i++)
		x=x.concat(getTerminals(i));
	return x;
}
function getTerminals(n){
	var count=1;
	ret=grammar[n].gives[0].split(" ");
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
	var tmp2=new Array;
	for(var i=0;i<tmp.length;i++){
		if(!(isNaN(parseInt(tmp[i])))){
			tmp2.push(tmp[i]);
			continue;
		}
		var ch=tmp[i].toLowerCase();
		if(tmp[i]==ch){
			console.log("yes");
			tmp2.push(tmp[i]);
		}
	}
	//console.log(tmp2);
	return tmp2;
}
