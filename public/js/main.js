$(document).ready(function($){
    ////----- Open the modal to CREATE a link -----////
    $('#btn-add').click(function () {
        $('#btn-save').val("add");

    });

    fetchRecords(0);

    // Fetch all records
    $('#but_fetchall').click(function(){
        fetchRecords(0);
    });


    // Clicking the save button on the open modal for both CREATE and UPDATE
    $("#btn-save").click(function (e) {
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });
        e.preventDefault();
        let formData = {
            name: $('#name').val(),
            description: $('#description').val(),
            price:$('#price').val()
        };
        let state = $('#btn-save').val();
        let type = "POST";
        let product_id = $('#product_id').val();
        let ajaxurl = 'products';
        if (state == "update") {
            type = "PUT";
            ajaxurl = 'products/' + product_id;
        }
        $.ajax({
            type: type,
            url: ajaxurl,
            data: formData,
            dataType: 'json',
            success: function (data) {
                var product = '' + data.id + '' + data.name + '' + data.description + '';
                product += ' ';
                product += '';
                if (state == "add") {
                    $('#links-list').append(product);
                } else {
                    $("#product" + product_id).replaceWith(product);
                }
            },
            error: function (data) {
                console.log('Error:', data);
            }
        });
    });

    ////----- DELETE a link and remove from the page -----////
    $('.delete-link').click(function () {
        let product_id = $(this).val();
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });
        $.ajax({
            type: "DELETE",
            url: 'products/' + product_id,
            success: function (data) {
                console.log(data);
                $("#product" + product_id).remove();
            },
            error: function (data) {
                console.log('Error:', data);
            }
        });
    });
});

function fetchRecords(id){
    $.ajax({
        url: 'http://127.0.0.1:8001/api/products',
        type: 'get',
        dataType: 'json',
        success: function(response){

            var len = 0;
            $('#userTable tbody').empty(); // Empty <tbody>
            if(response != null){
                len = response.length;
            }

            if(len > 0){
                for(let i=0; i<len; i++){
                    let id = response[i].id;
                    let name = response[i].name;
                    let description = response[i].description;
                    let price = response[i].price;
                    let editProductUrl = "{{ url('/products.edit', ':id') }}"
                    editProductUrl = editProductUrl.replace(':id', id);
                    let deleteProductUrl = "{{ url('/products.destroy', ':id') }}"
                    deleteProductUrl = deleteProductUrl.replace(':id', id);

                    let tr_str = '<tr>' +
                        '<td align="center">' + id + '</td>' +
                        '<td align="center">' + name + '</td>' +
                        '<td align="center">' + description + '</td>' +
                        '<td align="center">' + price + '</td>' +
                        <!-- Edit -->
                        '<td align="center">' +
                        '<a href="{{ }}" class="btn btn-sm btn-info">Edit</a>' +
                        <!-- Delete -->
                        '<a href="'+ deleteProductUrl +'" class="btn btn-sm btn-danger">Delete</a>' +
                        '</td>' +
                        '</tr>';

                    $("#productTable tbody").append(tr_str);
                }
            }else{
                let tr_str = "<tr>" +
                    "<td align='center' colspan='4'>No record found.</td>" +
                    "</tr>";

                $("#productTable tbody").append(tr_str);
            }

        }
    });
}
