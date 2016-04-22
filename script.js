var grammer = new Array();

function validate() 
{
    var input = document.getElementById("inp").value;
    alert(typeof(input));
    var state = input.split('\n');
    var j;
    
    for(j=0;j<state.length;j++)
    {
        var line = state[j];
        var exp = line.split("|");
        var i;

        var stm = new Object();

        stm.id = line[0];
        stm.gives = new Array();
        stm.first = new Array();
        stm.follow = new Array();

        var spli = exp[0].split('→');
        stm.gives.push(spli[1]);

        for (i = 1; i < exp.length; i++) 
        {
            stm.gives.push(exp[i]);    
        }
        for(i=0; i<stm.gives.length;i++)
            alert(stm.gives[i]);

        grammer.push(stm);
    }
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