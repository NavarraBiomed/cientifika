function uniqueAdd(){
		return function(p,d){
			if ( d["IdProRevistas"] in p.publicaciones ){
				console.log(d.IdProRevistas +" was already on the list ");
				p.publicaciones[d["IdProRevistas"]]++;		
				
			} else{
				console.log(d.IdProRevistas+" is not on the list");
				p.publicaciones[d["IdProRevistas"]] = 1;
                p.count++;
			}
	        return p;
		}

	}

	function uniqueRemove(){
		return function (p, d) {
	    	p.publicaciones[d["IdProRevistas"]]--;
            if (p.publicaciones[d["IdProRevistas"]] === 0) {
                delete p.publicaciones[d["IdProRevistas"]];
                p.count--;
            }
	        return p;
	    }
	}

	function uniqueInit(){
		return  function () {
					return {
						count:0,
						publicaciones: {
							/*
							id: 1 //id en cuestión
							count: 5 //veces que está esa id
							*/
						}
					};
			    }
	}